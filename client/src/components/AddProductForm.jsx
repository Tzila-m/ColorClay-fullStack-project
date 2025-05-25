import React, { useState } from 'react';
import { useCreateProductMutation } from '../features/productApiSlice';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

export default function AddProductForm({ onClose }) {
  const [createProduct] = useCreateProductMutation();
  const [formData, setFormData] = useState({ name: '', price: 0, code: '', imageUrl: '', categoryId: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProduct(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-column gap-3">
      <InputText placeholder="שם" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      <InputText placeholder="קוד מוצר" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
      <InputNumber placeholder="מחיר" value={formData.price} onValueChange={(e) => setFormData({ ...formData, price: e.value })} />
      <InputText placeholder="כתובת תמונה" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
      <InputText placeholder="קטגוריה" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} />
      <Button label="שמור" type="submit" />
    </form>
  );
}
