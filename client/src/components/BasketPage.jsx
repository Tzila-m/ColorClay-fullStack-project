import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeColor,
  clearBasket,
  increaseColorQuantity,
  decreaseColorQuantity,
  removeProduct,
  increaseProductQuantity,
  decreaseProductQuantity,
} from '../features/basketApiSlice';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const BasketPage = () => {
  const totalPrice = useSelector((state) => state.basket.totalPrice);
  const basketColors = useSelector((state) => state.basket.colors);
  const basketProducts = useSelector((state) => state.basket.products);

  const dispatch = useDispatch();
  const toast = useRef(null);

  const handleRemoveColor = (code) => {
    dispatch(removeColor(code));
    toast.current.show({ severity: 'info', summary: 'הוסר', detail: 'הצבע הוסר מהסל', life: 2000 });
  };

  const handleIncreaseColor = (code) => {
    dispatch(increaseColorQuantity(code));
  };

  const handleDecreaseColor = (code, quantity) => {
    if (quantity === 1) {
      confirmDialog({
        message: 'אתה בטוח שברצונך להסיר את הצבע מהסל?',
        header: 'אישור הסרה',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'כן',
        rejectLabel: 'לא',
        accept: () => {
          dispatch(removeColor(code));
          toast.current.show({ severity: 'info', summary: 'הוסר', detail: 'הצבע הוסר מהסל', life: 2000 });
        },
      });
    } else {
      dispatch(decreaseColorQuantity(code));
    }
  };

  const handleRemoveProduct = (code) => {
    dispatch(removeProduct(code));
    toast.current.show({ severity: 'info', summary: 'הוסר', detail: 'המוצר הוסר מהסל', life: 2000 });
  };

  const handleIncreaseProduct = (code) => {
    dispatch(increaseProductQuantity(code));
  };

  const handleDecreaseProduct = (code, quantity) => {
    if (quantity === 1) {
      confirmDialog({
        message: 'אתה בטוח שברצונך להסיר את המוצר מהסל?',
        header: 'אישור הסרה',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'כן',
        rejectLabel: 'לא',
        accept: () => {
          dispatch(removeProduct(code));
          toast.current.show({ severity: 'info', summary: 'הוסר', detail: 'המוצר הוסר מהסל', life: 2000 });
        },
      });
    } else {
      dispatch(decreaseProductQuantity(code));
    }
  };

  const handleCheckout = () => {
    toast.current.show({ severity: 'success', summary: 'מעבר לתשלום', detail: 'עבור לעמוד התשלום', life: 2000 });
  };

  if (basketColors.length === 0 && basketProducts.length === 0) {
    return (
      <div className="form-container p-6 text-center" style={{ minHeight: '300px' }}>
        סל הקניות שלך ריק
      </div>
    );
  }

  return (
    <div className="form-container" style={{ maxWidth: 600 }}>
      <Toast ref={toast} position="top-right" />
      <ConfirmDialog /> {/* חשוב - כאן מכניסים את רכיב ConfirmDialog */}
      <h2 className="form-title">סל הקניות</h2>

      {/* מוצרים */}
      {basketProducts.length > 0 && (
        <>
          <h3>מוצרים</h3>
          <div className="p-grid p-nogutter">
            {basketProducts.map(product => (
              <div key={product.code} className="p-col-12">
                <Card
                  className="color-card p-shadow-3"
                  style={{
                    textAlign: 'right',
                    borderRadius: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          objectFit: 'cover',
                          border: '1px solid #ccc',
                        }}
                      />
                      <span className="color-name">{product.name}</span>
                    </div>
                  }
                  subTitle={
                    <div className="text-sm text-gray-600 flex flex-col gap-1">
                      <span>קוד: {product.code}</span>
                      <span>מחיר ליחידה: {product.price.toFixed(2)} ₪</span>
                    </div>
                  }
                  footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <Button
                        label="-"
                        className="p-button-rounded p-button-secondary"
                        onClick={() => handleDecreaseProduct(product.code, product.quantity)}
                        style={{ width: 40, height: 40, fontWeight: 'bold' }}
                      />
                      <span style={{ minWidth: 30, textAlign: 'center' }}>{product.quantity || 1}</span>
                      <Button
                        label="+"
                        className="p-button-rounded p-button-secondary"
                        onClick={() => handleIncreaseProduct(product.code)}
                        style={{ width: 40, height: 40, fontWeight: 'bold' }}
                      />
                      <Button
                        label="הסר"
                        icon="pi pi-times"
                        className="p-button-danger"
                        style={{ borderRadius: 12, width: 80 }}
                        onClick={() => handleRemoveProduct(product.code)}
                      />
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* צבעים */}
      {basketColors.length > 0 && (
        <>
          <h3>צבעים</h3>
          <div className="p-grid p-nogutter">
            {basketColors.map(color => (
              <div key={color.code} className="p-col-12">
                <Card
                  className="color-card p-shadow-3"
                  style={{
                    textAlign: 'right',
                    borderRadius: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={color.imageUrl}
                        alt={color.name}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          objectFit: 'cover',
                          border: '1px solid #ccc',
                        }}
                      />
                      <span className="color-name">{color.name}</span>
                    </div>
                  }
                  subTitle={<span className="color-code">קוד: {color.code}</span>}
                  footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <Button
                        label="-"
                        className="p-button-rounded p-button-secondary"
                        onClick={() => handleDecreaseColor(color.code, color.quantity)}
                        style={{ width: 40, height: 40, fontWeight: 'bold' }}
                      />
                      <span style={{ minWidth: 30, textAlign: 'center' }}>{color.quantity || 1}</span>
                      <Button
                        label="+"
                        className="p-button-rounded p-button-secondary"
                        onClick={() => handleIncreaseColor(color.code)}
                        style={{ width: 40, height: 40, fontWeight: 'bold' }}
                      />
                      <Button
                        label="הסר"
                        icon="pi pi-times"
                        className="p-button-danger"
                        style={{ borderRadius: 12, width: 80 }}
                        onClick={() => handleRemoveColor(color.code)}
                      />
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        </>
      )}

      <hr />
      <div style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
        סה"כ לתשלום: {totalPrice.toFixed(2)} ₪
      </div>

      <div className="p-d-flex p-jc-between" style={{ marginTop: 16 }}>
        <Button
          label="המשך לתשלום"
          className="p-button-success p-button-rounded"
          onClick={handleCheckout}
        />
      </div>
    </div>
  );
};

export default BasketPage;
