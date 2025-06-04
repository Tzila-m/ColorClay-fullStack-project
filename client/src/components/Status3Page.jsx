import React, { useEffect } from 'react';
import { useGetOrdersByStatusQuery, useMarkOrderReadyMutation } from '../features/orderApiSlice';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';

const statusMap = {
  "3": { label: 'הכלי בטיפול', color: 'info' },
};

const Status3Page = () => {
  const { data: completeOrders, isLoading, isError, error, refetch } = useGetOrdersByStatusQuery("3");
  const [markOrderReady, { isLoading: isUpdating }] = useMarkOrderReadyMutation();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleMarkReady = async (orderId) => {
    try {
      await markOrderReady(orderId).unwrap();
      refetch();
    } catch (err) {
      console.error('שגיאה בעדכון סטטוס:', err);
    }
  };

  if (isLoading) return <div className="flex justify-content-center"><ProgressSpinner /></div>;
  if (isError) return <div className="p-4 text-red-600">שגיאה: {error.message}</div>;

  if (!completeOrders || completeOrders.length === 0) {
    return <div className="p-4" style={{ maxWidth: '800px', margin: 'auto' }}>לא נמצאו הזמנות במצב זה.</div>;
  }

  return (
    <div className="p-4" style={{ maxWidth: '800px', margin: 'auto' }}>
      <h2 className="form-title mb-4">הזמנות שמצפות להודעה שהכלי מוכן (סטטוס 3)</h2>
      {completeOrders.map((order, index) => (
        <Card key={order._id || index} className="mb-3">
          <div className="flex flex-column md:flex-row md:justify-content-between align-items-center">
            <div>
              <p><strong>מס׳ הזמנה:</strong> {order._id || '---'}</p>
              <p><strong>שם לקוח:</strong> {order.userId?.name || '---'}</p>
              <p><strong>תאריך:</strong> {order.date ? new Date(order.date).toLocaleDateString() : '---'}</p>
              <p><strong>סכום לתשלום:</strong> {order.totalPrice ? `${order.totalPrice} ₪` : '---'}</p>
            </div>
            <div className="flex align-items-center gap-3">
              <Tag
                value={statusMap["3"].label}
                severity={statusMap["3"].color}
                className="p-tag-rounded p-tag-plain"
                style={{ fontSize: '1rem', padding: '0.3rem 0.75rem', fontWeight: '500' }}
              />
              <Button
                label="הכלי מוכן לאיסוף"
                icon="pi pi-check"
                disabled={isUpdating}
                onClick={() => handleMarkReady(order._id)}
                className="p-button-sm p-button-success"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Status3Page;
