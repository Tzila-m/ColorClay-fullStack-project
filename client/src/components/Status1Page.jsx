import React from 'react';
import { useGetTodayReservationsQuery } from '../features/tableAvailabilityApiSlice'; // שים את השם הנכון
import { ListBox } from 'primereact/listbox';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';

const statusMap = {
  "1": { label: 'הוזמן שולחן', color: 'info' },
  "2": { label: 'הוזמנו מוצרים וצבעים', color: 'warning' },
  "3": { label: 'שולם ואושר', color: 'success' },
  "4": { label: 'מוכן לאיסוף', color: 'danger' },
};

const Status1Page = () => {
  const { data, isLoading, isError } = useGetTodayReservationsQuery();
  const orders = data || [];

  console.log('Orders data:', data);
  

  if (isLoading) return <div className="flex justify-content-center"><ProgressSpinner /></div>;
  if (isError) return <div>שגיאה בטעינה</div>;

  if (orders.length === 0) return <div className="p-4" style={{ maxWidth: '800px', margin: 'auto' }}>אין הזמנות להיום</div>;

  return (
    <div className="p-4" style={{ maxWidth: '800px', margin: 'auto' }}>
      <h2 className="form-title">הזמנות להיום</h2>
      {orders.map((order, index) => (
        <Card key={order._id || index} className="mb-3">
          <div className="flex flex-column md:flex-row md:justify-content-between align-items-center">
            <div>
              <p><strong>משמרת:</strong> {order.timeSlot === 'morning' ? 'בוקר' : order.timeSlot === 'afternoon' ? 'צהריים' : 'ערב'}</p>
              <p><strong>מספר שולחן:</strong> {order.tableId?.tableNumber || '---'}</p>
              <p><strong>שם לקוח:</strong> {order.userId?.name || '---'}</p>
              <p><strong>טלפון:</strong> {order.userId?.phone || '---'}</p>
            </div>
            <Tag 
              value={statusMap[order.status]?.label || 'לא ידוע'} 
              severity={statusMap[order.status]?.color || 'secondary'} 
              style={{ fontSize: '1.1rem', padding: '0.5rem 1rem' }} 
            />
          </div>
        </Card>
      ))}
    </div>
  );
};


export default Status1Page;
