import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';
import { useNavigate } from 'react-router-dom';

const statusMap = {
  "1": { label: 'הוזמן שולחן', color: 'info' },
  "2": { label: 'הוזמנו מוצרים וצבעים', color: 'warning' },
  "3": { label: 'שולם ואושר', color: 'success' },
  "4": { label: 'מוכן לאיסוף', color: 'danger' },
};

const timeSlotMap = {
  morning: 'בוקר',
  afternoon: 'צהריים',
  evening: 'ערב',
};

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const orders = useSelector((state) => state.order.orders);


  if (!user) {
    return <div className="flex justify-content-center mt-5">לא מחובר</div>;
  }
if (!orders.length) {
    return (
      <div className="p-4" style={{ maxWidth: '800px', margin: 'auto' }}>
        עדיין לא ביצעתה הזמנה<br />
        <span
          onClick={() => navigate('/table')}
          style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
        >
          להזמנת שולחן
        </span>
      </div>
    );
  }
{ console.log(orders)
}
  return (
    <div className="p-4" style={{ maxWidth: '800px', margin: 'auto' }}>
      <h2 className="form-title">היסטוריית הזמנות</h2>
      {orders.map((order, index) => (
        <Card key={order._id || index} className="mb-3">
          <div className="flex flex-column md:flex-row md:justify-content-between align-items-center mb-3">
            <div>
              <p><strong>מספר הזמנה:</strong> {order._id}</p>
              <p><strong>תאריך:</strong> {new Date(order.date).toLocaleDateString('he-IL')}</p>
              <p><strong>משמרת:</strong> {timeSlotMap[order.timeSlot]}</p>
              <p><strong>מספר שולחן:</strong> {order.tableId?.tableNumber || '---'}</p>
              <p><strong>סכום כולל:</strong> ₪{order.totalPrice?.toFixed(2)}</p>
            </div>
            <Tag
              value={statusMap[order.status]?.label || 'לא ידוע'}
             
              
              severity={statusMap[order.status]?.color || 'secondary'}
              style={{ fontSize: '1.1rem', padding: '0.5rem 1rem' }}
            />
          </div>

          {/* הצגת מוצרים */}
          <div className="mb-2">
            <strong>מוצרים:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {order.productIds?.length ? (
                order.productIds.map((product, idx) => (
                  <Chip key={idx} label={product.name} className="mr-2" />
                ))
              ) : (
                <span> אין מוצרים</span>
              )}
            </div>
          </div>

          {/* הצגת צבעים */}
          <div>
            <strong>צבעים:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {order.colorIds?.length ? (
                order.colorIds.map((color, idx) => (
                  <Chip
                    key={idx}
                    label={color.name}
                    style={{ backgroundColor: color.hex || '#eee', color: '#000' }}
                    className="mr-2"
                  />
                ))
              ) : (
                <span> אין צבעים</span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default OrderHistoryPage;
