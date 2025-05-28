import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';

import {
    useGetProductByCategoryQuery,
    useDeleteProductMutation,
    useUpdateAvailableProductMutation,
    useCreateProductMutation
} from '../features/productApiSlice';

import ProductCard from './ProductCard';
import { addProduct } from '../features/basketApiSlice';

export default function ProductsPage() {
    const { categoryId } = useParams();
    const dispatch = useDispatch();
    const toast = useRef(null);

    const user = useSelector(state => state.auth.user);
    const isAdmin = user?.roles === 'admin';

    const {
        data: products = [],
        isLoading,
        isError,
        error
    } = useGetProductByCategoryQuery(categoryId, {
        pollingInterval: 5000
    });

    const [deleteProduct] = useDeleteProductMutation();
    const [updateAvailable] = useUpdateAvailableProductMutation();
    const [createProduct] = useCreateProductMutation();

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        code: '',
        price: 0,
        imageUrl: '',
        isAvailable: true,
    });

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    const toggleProductSelect = (productId, isAvailable) => {
        if (!isAvailable) {
            toast.current.show({ severity: 'warn', summary: 'המוצר אינו זמין כעת', life: 3000 });
            return;
        }
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleDelete = async (id) => {
        if (!window.confirm('בטוח/ה שברצונך למחוק את המוצר?')) return;

        try {
            await deleteProduct(id).unwrap();
            toast.current.show({ severity: 'success', summary: 'המוצר נמחק בהצלחה', life: 3000 });
            setSelectedProducts(prev => prev.filter(pid => pid !== id));
        } catch {
            toast.current.show({ severity: 'error', summary: 'שגיאה במחיקת המוצר', life: 3000 });
        }
    };

    const handleToggleAvailable = async (id) => {
        try {
            await updateAvailable(id).unwrap();
            toast.current.show({ severity: 'success', summary: 'זמינות המוצר עודכנה', life: 3000 });
        } catch {
            toast.current.show({ severity: 'error', summary: 'שגיאה בעדכון זמינות', life: 3000 });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setNewProduct(prev => ({ ...prev, imageUrl: reader.result }));
            setImageFile(file);
        };
        reader.readAsDataURL(file);
    };

    const handleAddProduct = async () => {
        if (!newProduct.name.trim() || !newProduct.code.trim() || newProduct.price <= 0 || !newProduct.imageUrl) {
            toast.current.show({ severity: 'warn', summary: 'אנא מלא את כל השדות', life: 3000 });
            return;
        }
        try {
            await createProduct({ ...newProduct, categoryId }).unwrap();
            toast.current.show({ severity: 'success', summary: 'המוצר נוסף בהצלחה', life: 3000 });
            setShowAddDialog(false);
            setNewProduct({ name: '', code: '', price: 0, imageUrl: '', isAvailable: true });
            setImageFile(null);
        } catch {
            toast.current.show({ severity: 'error', summary: 'שגיאה בהוספת מוצר', life: 3000 });
        }
    };

    const handleAddSelectedToBasket = () => {
        selectedProducts.forEach(productId => {
            const product = products.find(p => p._id === productId);
            if (product) {
                dispatch(addProduct(product));
            }
        });
        toast.current.show({ severity: 'success', summary: 'המוצרים נוספו לסל', life: 3000 });
        setSelectedProducts([]);
    };

    if (isLoading) return <div className="p-4 text-center text-xl">טוען מוצרים...</div>;
    if (isError) return <div className="p-4 text-center text-red-500">שגיאה: {error?.message}</div>;

    return (
        <div className="w-screen max-w-none px-6 py-12" style={{ background: 'linear-gradient(135deg, #ecf0f3, #ffffff)' }}>
            <Toast ref={toast} />
            <h1 className="text-center text-5xl font-bold mb-14 text-[#333]">מוצרים</h1>

            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {products.map(product => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        isAdmin={isAdmin}
                        isSelected={selectedProducts.includes(product._id)}
                        onClick={() => toggleProductSelect(product._id, product.isAvailable)}
                        onDelete={() => handleDelete(product._id)}
                        onToggleAvailable={() => handleToggleAvailable(product._id)}
                    />
                ))}
            </div>

            {!isAdmin && (
                <Button
                    label="הוסף לסל"
                    icon="pi pi-shopping-cart"
                    className="p-button-success mt-6"
                    onClick={handleAddSelectedToBasket}
                    disabled={selectedProducts.length === 0}
                />
            )}

            {isAdmin && (
                <Button
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-success fixed bottom-6 right-6 shadow-3 z-50"
                    onClick={() => setShowAddDialog(true)}
                    tooltip="הוסף מוצר"
                    tooltipOptions={{ position: 'top' }}
                    style={{ width: '3.5rem', height: '3.5rem' }}
                />
            )}

            <Dialog
                header="הוספת מוצר חדש"
                visible={showAddDialog}
                style={{ width: '400px' }}
                onHide={() => setShowAddDialog(false)}
                footer={
                    <div>
                        <Button label="ביטול" icon="pi pi-times" className="p-button-text" onClick={() => setShowAddDialog(false)} />
                        <Button label="שמור" icon="pi pi-check" className="p-button-primary" onClick={handleAddProduct} />
                    </div>
                }
            >
                <div className="field mb-3">
                    <label htmlFor="name" className="block mb-2">שם המוצר</label>
                    <InputText
                        id="name"
                        className="w-full"
                        value={newProduct.name}
                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                </div>

                <div className="field mb-3">
                    <label htmlFor="code" className="block mb-2">קוד מוצר</label>
                    <InputText
                        id="code"
                        className="w-full"
                        value={newProduct.code}
                        onChange={e => setNewProduct({ ...newProduct, code: e.target.value })}
                    />
                </div>

                <div className="field mb-3">
                    <label htmlFor="price" className="block mb-2">מחיר</label>
                    <InputNumber
                        id="price"
                        className="w-full"
                        value={newProduct.price}
                        onValueChange={e => setNewProduct({ ...newProduct, price: e.value })}
                        mode="currency"
                        currency="ILS"
                        locale="he-IL"
                    />
                </div>

                <div className="field mb-3">
                    <label htmlFor="imageFile" className="block mb-2">בחר תמונה</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full"
                    />
                    {newProduct.imageUrl && (
                        <img src={newProduct.imageUrl} alt="preview" className="mt-2 rounded" style={{ maxWidth: '100%', maxHeight: 200 }} />
                    )}
                </div>

                <div className="field mb-3 flex align-items-center gap-2">
                    <Checkbox
                        inputId="isAvailable"
                        checked={newProduct.isAvailable}
                        onChange={e => setNewProduct({ ...newProduct, isAvailable: e.checked })}
                    />
                    <label htmlFor="isAvailable">זמין למכירה</label>
                </div>
            </Dialog>
        </div>
    );
}