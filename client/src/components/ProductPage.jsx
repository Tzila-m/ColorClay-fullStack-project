import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

import {
    useGetProductByCategoryQuery,
    useDeleteProductMutation,
    useUpdateAvailableProductMutation,
    useCreateProductMutation
} from '../features/productApiSlice';

import ProductCard from './ProductCard';
import { addProduct } from '../features/basketApiSlice';

import '../css/Product.css';

export default function ProductsPage() {
    const { categoryId } = useParams();
    const dispatch = useDispatch();
    const toast = useRef(null);

    const user = useSelector(state => state.auth.user);
    const isAdmin = user?.roles === 'admin';

    const { data: products = [], isLoading, isError, error } = useGetProductByCategoryQuery(categoryId, { pollingInterval: 5000 });

    const [deleteProduct] = useDeleteProductMutation();
    const [updateAvailable] = useUpdateAvailableProductMutation();
    const [createProduct] = useCreateProductMutation();

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        code: '',
        price: 0,
        imageUrl: '',
        isAvailable: true
    });

    const [selectedProducts, setSelectedProducts] = useState([]);

    const handleSelect = (productId, isAvailable) => {
        if (!isAvailable) {
            toast.current.show({ severity: 'warn', summary: 'המוצר אינו זמין', life: 3000 });
            return;
        }
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleDelete = async (id) => {
        if (!window.confirm('בטוח שברצונך למחוק את המוצר?')) return;
        try {
            await deleteProduct(id).unwrap();
            toast.current.show({ severity: 'success', summary: 'נמחק בהצלחה', life: 3000 });
        } catch {
            toast.current.show({ severity: 'error', summary: 'שגיאה במחיקה', life: 3000 });
        }
    };

    const handleToggleAvailable = async (id) => {
        try {
            await updateAvailable(id).unwrap();
            toast.current.show({ severity: 'success', summary: 'עודכן בהצלחה', life: 3000 });
        } catch {
            toast.current.show({ severity: 'error', summary: 'שגיאה בעדכון', life: 3000 });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewProduct(prev => ({ ...prev, imageUrl: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.code || newProduct.price <= 0 || !newProduct.imageUrl) {
            toast.current.show({ severity: 'warn', summary: 'יש למלא את כל השדות', life: 3000 });
            return;
        }
        try {
            await createProduct({ ...newProduct, categoryId }).unwrap();
            toast.current.show({ severity: 'success', summary: 'מוצר נוסף', life: 3000 });
            setShowAddDialog(false);
            setNewProduct({ name: '', code: '', price: 0, imageUrl: '', isAvailable: true });
        } catch {
            toast.current.show({ severity: 'error', summary: 'שגיאה בהוספה', life: 3000 });
        }
    };

    const handleAddToBasket = () => {
        selectedProducts.forEach(id => {
            const product = products.find(p => p._id === id);
            if (product) dispatch(addProduct(product));
        });
        toast.current.show({ severity: 'success', summary: 'המוצרים נוספו לסל', life: 3000 });
        setSelectedProducts([]);
    };

    if (isLoading) return <div className="loading-text">טוען מוצרים...</div>;
    if (isError) return <div className="error-text">שגיאה: {error?.message}</div>;

    return (
        <div className="products-page-container">
            <Toast ref={toast} />
            <h1 className="page-title">מוצרים</h1>

            <div className="products-grid">
                {products.map(product => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        isAdmin={isAdmin}
                        isSelected={selectedProducts.includes(product._id)}
                        onClick={handleSelect}
                        onDelete={handleDelete}
                        onToggleAvailable={handleToggleAvailable}
                    />
                ))}
            </div>

            {!isAdmin && (
                <Button
                    icon="pi pi-shopping-cart"
                    className="p-button-rounded p-button-success fixed-add-to-cart"
                    onClick={handleAddToBasket}
                    disabled={selectedProducts.length === 0}
                    tooltip="הוסף לסל"
                    tooltipOptions={{ position: 'left' }}
                />
            )}


            {isAdmin && (
                <Button
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-success"
                    style={{ position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px' }}
                    onClick={() => setShowAddDialog(true)}
                    tooltip="הוסף מוצר חדש"
                />
            )}

            <Dialog
                header="הוספת מוצר חדש"
                visible={showAddDialog}
                style={{ width: '400px' }}
                onHide={() => setShowAddDialog(false)}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Button label="ביטול" icon="pi pi-times" className="p-button-text" onClick={() => setShowAddDialog(false)} />
                        <Button label="שמור" icon="pi pi-check" className="p-button-primary" onClick={handleAddProduct} />
                    </div>
                }
            >
                <div className="add-product-form">
                    <label htmlFor="name">שם מוצר</label>
                    <InputText
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                        autoFocus
                    />

                    <label htmlFor="code">קוד</label>
                    <InputText
                        id="code"
                        value={newProduct.code}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, code: e.target.value }))}
                    />

                    <label htmlFor="price">מחיר</label>
                    <div className="price-input-wrapper">
                        <InputText
                            id="price"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                            min="0"
                            className="price-input"
                        />
                        <span className="price-suffix">₪</span>
                    </div>


                    <label htmlFor="image">תמונה</label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ marginBottom: '1rem' }}
                    />
                    {newProduct.imageUrl && (
                        <img src={newProduct.imageUrl} alt="תצוגה מקדימה" style={{ width: '100%', borderRadius: '12px' }} />
                    )}
                </div>
            </Dialog>
        </div>
    );
}
