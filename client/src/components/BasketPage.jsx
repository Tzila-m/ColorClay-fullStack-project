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
import { addOrder, updateOrder, completeOrder } from '../features/orderSlice';
import { useConfirmOrderPaymentMutation, useAddProductsAndColorsMutation, useGetOrderByIdQuery } from '../features/orderApiSlice';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const BasketPage = () => {
  const dispatch = useDispatch();
  const toast = useRef(null);

  const totalPrice = useSelector((state) => state.basket.totalPrice);
  const basketColors = useSelector((state) => state.basket.colors);
  const basketProducts = useSelector((state) => state.basket.products);
  const orders = useSelector((state) => state.order.orders);

  console.log("orders", orders);
  console.log("orderId", orders[0]);
  const [confirmOrderPayment, { isLoading: isConfirmLoading }] = useConfirmOrderPaymentMutation();
  const [addProductsAndColorsMutation, { isLoading: isAddLoading }] = useAddProductsAndColorsMutation();


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

  // פונקציה לשליחת מוצרים וצבעים להזמנה
  const addProducts = async () => {
    const productIds = basketProducts.map((p) => p._id);
    const colorIds = basketColors.map((c) => c._id);

    // const body = { productIds, colorIds };

    const timeSlots = [
      { name: "morning", start: 8, end: 12 },
      { name: "afternoon", start: 13, end: 16 },
      { name: "evening", start: 17, end: 22 },
    ];

    const date = new Date();
    const currentHour = date.getHours();
    console.log("currentHour", currentHour);

    const todayUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    const validOrder = orders.find((order) => {
      return (order.status === "1" || order.status === "2") &&
        timeSlots.find((slot) => (
          slot.name === order.timeSlot && currentHour >= slot.start && currentHour < slot.end
        ))
    })

    console.log("orders", orders);
    console.log("validOrder", validOrder);


    if (validOrder) {
      try {
        console.log("productIds", productIds)
        console.log("colorIds", colorIds);

        const object = await addProductsAndColorsMutation({ orderId: validOrder._id, productIds, colorIds }).unwrap();
        dispatch(clearBasket());
        toast.current.show({
          severity: "success",
          summary: "תכף תקבל את המוצרים",
          life: 4000,
        });
        dispatch(updateOrder({ orderId: validOrder._id, productIds, colorIds }));
      }
      catch (error) {
        toast.current.show({
          severity: "error",
          summary: "שגיאה",
          detail: error?.data?.message || "שגיאה באישור ההזמנה",
          life: 3000,
        });
      }
    } else {
      toast.current.show({
        severity: "error",
        summary: "שגיאה",
        detail: "אין הזמנה פעילה להוספת מוצרים",
        life: 3000,
      });
    }
  };


  const handleCheckout = async () => {

    const timeSlots = [
      { name: "morning", start: 8, end: 12 },
      { name: "afternoon", start: 13, end: 16 },
      { name: "evening", start: 17, end: 22 },
    ];

    const date = new Date();
    const currentHour = date.getHours();
    console.log("currentHour", currentHour);

    const todayUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    const validOrder = orders.find((order) => {
      return (order.status === "2") &&
        timeSlots.find((slot) => (
          slot.name === order.timeSlot && currentHour >= slot.start 
        ))
    })

    if (validOrder) {
      const orderId = validOrder._id;
      try {

        const object = await confirmOrderPayment(orderId).unwrap();
        dispatch(clearBasket());

        toast.current.show({
          severity: "success",
          summary: `מעבר לתשלום בסך ${object.totalPrice} ₪`,
          life: 4000,
        });
        dispatch(completeOrder({ orderId: validOrder._id, totalPrice: object.totalPrice }));
      }
      catch (error) {
        toast.current.show({
          severity: "error",
          summary: "שגיאה",
          detail: error?.data?.message || "שגיאה באישור ההזמנה",
          life: 3000,
        });
      }
    } else {
      toast.current.show({
        severity: "error",
        summary: "שגיאה",
        detail: "אין הזמנה פעילה להוספת מוצרים",
        life: 3000,
      });
    }
  }

  return (
    <div className="form-container" style={{ maxWidth: 600 }}>
      <Toast ref={toast} position="top-right" />
      <ConfirmDialog />
      <h2 className="form-title">סל הקניות</h2>

      {/* מוצרים */}
      {basketProducts.length > 0 && (
        <>
          <h3>מוצרים</h3>
          <div className="p-grid p-nogutter">
            {basketProducts.map((product) => (
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
            {basketColors.map((color) => (
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
          label={isAddLoading ? 'מעבד...' : 'להזמנה וקבלת מוצרים'}
          className="p-button-success p-button-rounded"
          onClick={addProducts}
          disabled={isAddLoading}
        />
        <Button
          label={isAddLoading ? 'מעבד...' : ' סיום אפשרות הזמנה, ומעבר לתשלום'}
          className="p-button-success p-button-rounded"
          onClick={handleCheckout}
          disabled={isConfirmLoading}
        />
      </div>
    </div>
  );
};

export default BasketPage;
