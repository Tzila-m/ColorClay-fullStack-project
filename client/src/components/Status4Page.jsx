import React from 'react';
import { useGetOrdersByStatusQuery } from '../features/orderApiSlice';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';

const statusMap = {
  "4": { label: 'ההזמנה הושלמה', color: 'custom' },
};

const Status4Page = () => {
  const { data: completeOrders, isLoading, isError, error } = useGetOrdersByStatusQuery("4");

  if (isLoading) return <div className="flex justify-content-center"><ProgressSpinner /></div>;
  if (isError) return <div className="p-4 text-red-600">שגיאה: {error.message}</div>;

  if (!completeOrders || completeOrders.length === 0) {
    return <div className="p-4" style={{ maxWidth: '800px', margin: 'auto' }}>לא נמצאו הזמנות שהושלמו.</div>;
  }

  return (
    <div className="p-4" style={{ maxWidth: '800px', margin: 'auto' }}>
      <h2 className="form-title mb-4">הזמנות שהושלמו (סטטוס 4)</h2>
      {completeOrders.map((order, index) => {
        console.log("order:", order); // ✅ כך מדפיסים בצורה נכונה
        return (
          <Card key={order._id || index} className="mb-3">
            <div className="flex flex-column md:flex-row md:justify-content-between align-items-center">
              <div>
                <p><strong>מס׳ הזמנה:</strong> {order._id || '---'}</p>
                <p><strong>שם לקוח:</strong> {order.userId?.name || '---'}</p>
                <p><strong>תאריך:</strong> {order.date ? new Date(order.date).toLocaleDateString() : '---'}</p>
                <p><strong>סכום לתשלום:</strong> {order.totalPrice ? `${order.totalPrice} ₪` : '---'}</p>

              </div>
              <Tag
                value={statusMap["4"].label}
                severity={statusMap["4"].color}
                className="p-tag-rounded p-tag-plain"
                style={{ fontSize: '1rem', padding: '0.3rem 0.75rem', fontWeight: '500' }}
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default Status4Page;
