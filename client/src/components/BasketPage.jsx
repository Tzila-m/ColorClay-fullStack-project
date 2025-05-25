import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeColor, clearBasket, increaseColorQuantity, decreaseColorQuantity } from '../features/basketApiSlice';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';


const BasketPage = () => {
  const totalPrice = useSelector((state) => state.basket.totalPrice);

  const dispatch = useDispatch();
  const basketColors = useSelector((state) => state.basket.colors);
  const toast = useRef(null);

  const handleRemove = (id) => {
    dispatch(removeColor(id));
    toast.current.show({ severity: 'info', summary: 'הוסר', detail: 'הצבע הוסר מהסל', life: 2000 });
  };

  const handleIncrease = (id) => {
    dispatch(increaseColorQuantity(id));
  };

  const handleDecrease = (id, quantity) => {
    if (quantity === 1) {
      confirmDialog({
        message: 'אתה בטוח שברצונך להסיר את הצבע מהסל?',
        header: 'אישור הסרה',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'כן',
        rejectLabel: 'לא',
        accept: () => {
          dispatch(removeColor(id));
          toast.current.show({ severity: 'info', summary: 'הוסר', detail: 'הצבע הוסר מהסל', life: 2000 });
        }
      });
    } else {
      dispatch(decreaseColorQuantity(id));
    }
  };

  const confirmClearBasket = () => {
    confirmDialog({
      message: 'בטוח/ה שברצונך לרוקן את סל הקניות?',
      header: 'אישור',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'כן',
      rejectLabel: 'לא',
      accept: () => {
        dispatch(clearBasket());
        toast.current.show({ severity: 'warn', summary: 'סל רוקן', detail: 'סל הקניות רוקן בהצלחה', life: 2500 });
      }
    });
  };

  const handleCheckout = () => {
    toast.current.show({ severity: 'success', summary: 'מעבר לתשלום', detail: 'עבור לעמוד התשלום', life: 2000 });
  };

  if (basketColors.length === 0) {
    return (
      <div className="form-container p-6 text-center" style={{ minHeight: '300px' }}>
        סל הקניות שלך ריק
      </div>
    );
  }

  return (
    <div className="form-container" style={{ maxWidth: 600 }}>
      <Toast ref={toast} position="top-center" />
      <h2 className="form-title">סל הקניות</h2>
      <div className="p-grid p-nogutter">
        {basketColors.map(color => (
          <div key={color._id} className="p-col-12">
            <Card
              className="color-card p-shadow-3"
              style={{ textAlign: 'right', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              title={<span className="color-name">{color.name}</span>}
              subTitle={<span className="color-code">קוד: {color.code}</span>}
              header={
                color.imageUrl && (
                  <img
                    alt={color.name}
                    src={color.imageUrl}
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: '50%',
                      border: '4px solid #fcdada',
                      objectFit: 'cover',
                      display: 'block',
                      marginLeft: 'auto',
                    }}
                  />
                )
              }
              footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <Button
                    label="-"
                    className="p-button-rounded p-button-secondary"
                    onClick={() => handleDecrease(color._id, color.quantity)}
                    style={{ width: 40, height: 40, fontWeight: 'bold' }}
                  />
                  <span style={{ minWidth: 30, textAlign: 'center' }}>{color.quantity || 1}</span>
                  <Button
                    label="+"
                    className="p-button-rounded p-button-secondary"
                    onClick={() => handleIncrease(color._id)}
                    style={{ width: 40, height: 40, fontWeight: 'bold' }}
                  />
                  <Button
                    label="הסר"
                    icon="pi pi-times"
                    className="p-button-danger"
                    style={{ borderRadius: 12, width: 80 }}
                    onClick={() => handleRemove(color._id)}
                  />
                </div>
              }
            />
          </div>
        ))}
      </div>

      <Button
        label="רוקן סל"
        icon="pi pi-trash"
        className="p-button-warning"
        style={{ marginTop: 20, borderRadius: 12, width: '100%' }}
        onClick={confirmClearBasket}
      />

      <Button
        label="מעבר לתשלום"
        icon="pi pi-credit-card"
        className="p-button-success"
        style={{ marginTop: 12, borderRadius: 12, width: '100%' }}
        onClick={handleCheckout}
        
      />
            <div
        style={{
          position: 'sticky',
          bottom: 0,
          backgroundColor: '#fff',
          padding: '16px',
          borderTop: '1px solid #ccc',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          zIndex: 10
        }}
      >
        סך הכל לתשלום: ₪{totalPrice.toFixed(2)}
      </div>
    </div>
  );
};

export default BasketPage;
