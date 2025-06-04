import React from 'react';
import { useGetOrdersByStatusQuery } from '../features/orderApiSlice'; // ודא שזה הנתיב הנכון
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';

const statusMap = {
  "1": { label: 'הוזמן שולחן', color: 'info' },
  "2": { label: 'הוזמנו מוצרים וצבעים', color: 'warning' },
  "3": { label: 'שולם ואושר', color: 'success' },
  "4": { label: 'מוכן לאיסוף', color: 'danger' },
};

const Status2Page = () => {
  const { data, isLoading, isError } = useGetOrdersByStatusQuery(2);
  const orders = data || [];

  if (isLoading) {
    return (
      <div className="flex justify-content-center p-4">
        <ProgressSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500 text-center">
        שגיאה בטעינת ההזמנות
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-4 text-center">
        אין הזמנות בסטטוס זה
      </div>
    );
  }

  return (
    <div className="p-4" style={{ maxWidth: '900px', margin: 'auto' }}>
      <h2 className="text-2xl font-bold mb-4 text-center">הזמנות עם מוצרים וצבעים</h2>

      {orders.map((order) => (
        <Card key={order._id} className="mb-4 shadow-2">
          <div className="flex flex-column md:flex-row md:justify-content-between align-items-center mb-3">
            <div>
              <p><strong>משמרת:</strong> {order.timeSlot === 'morning' ? 'בוקר' : order.timeSlot === 'afternoon' ? 'צהריים' : 'ערב'}</p>
              <p><strong>מספר שולחן:</strong> {order.tableId?.tableNumber || '---'}</p>
              <p><strong>שם לקוח:</strong> {order.userId?.name || '---'}</p>
              <p><strong>טלפון:</strong> {order.userId?.phone || '---'}</p>
            </div>
            <Tag
              value={statusMap[order.status]?.label || 'לא ידוע'}
              severity={statusMap[order.status]?.color || 'secondary'}
              style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
            />
          </div>

          <div className="mb-2">
            <strong>מוצרים:</strong>
            <ul className="ml-4 list-disc">
              {(order.productIds || []).map((product, i) => (
                <li key={i}>{product.name} (כמות: {product.quantity || 1})</li>
              ))}
            </ul>
          </div>

          <div>
            <strong>צבעים:</strong>
            <ul className="flex flex-wrap gap-2 mt-2">
              {(order.colorIds || []).map((color, i) => (
                <li key={i} style={{
                  backgroundColor: color.code,
                  padding: '0.4rem 0.8rem',
                  borderRadius: '10px',
                  color: '#fff',
                  fontWeight: 'bold'
                }}>
                  {color.name}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Status2Page;
