import React, { useState, useRef } from 'react';
import {
    useGetProductByCategoryQuery,
    useDeleteProductMutation,
    useUpdateAvailableProductMutation,
    useCreateProductMutation
} from '../features/productApiSlice';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { addProduct } from '../features/basketApiSlice'; // ודא שזה נכון לפי הפרויקט שלך

export default function ProductsPage() {
    const { categoryId } = useParams();
    const toast = useRef(null);
    const dispatch = useDispatch();

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        code: '',
        price: 0,
        imageUrl: '',
        isAvailable: true,
    });

    const [selectedProducts, setSelectedProducts] = useState([]);

    const user = useSelector((state) => state.auth.user);
    const isAdmin = user?.roles === 'admin';

    const { data: products = [], isLoading, isError, error } = useGetProductByCategoryQuery(categoryId);
    const [deleteProduct] = useDeleteProductMutation();
    const [updateAvailable] = useUpdateAvailableProductMutation();
    const [createProduct] = useCreateProductMutation();

    const handleDelete = async (id) => {
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
            toast.current.show({ severity: 'error', summary: 'שגיאה בעדכון זמינות', life: 3000 });
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.name.trim() || !newProduct.code.trim() || newProduct.price <= 0 || !newProduct.imageUrl.trim()) {
            toast.current.show({ severity: 'warn', summary: 'אנא מלא את כל השדות', life: 3000 });
            return;
        }
        try {
            await createProduct({ ...newProduct, categoryId }).unwrap();
            toast.current.show({ severity: 'success', summary: 'המוצר נוסף בהצלחה', life: 3000 });
            setShowAddDialog(false);
            setNewProduct({ name: '', code: '', price: 0, imageUrl: '', isAvailable: true });
        } catch {
            toast.current.show({ severity: 'error', summary: 'שגיאה בהוספת מוצר', life: 3000 });
        }
    };

    const toggleProductSelect = (productId, isAvailable) => {
        if (!isAvailable) {
            toast.current.show({ severity: 'warn', summary: 'המוצר אינו זמין', life: 2000 });
            return;
        }

        setSelectedProducts((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    const handleAddSelectedToBasket = () => {
        selectedProducts.forEach((productId) => {
            const product = products.find((p) => p._id === productId);
            if (product) dispatch(addProduct(product));
        });
        toast.current.show({ severity: 'success', summary: 'המוצרים נוספו לסל', life: 3000 });
        setSelectedProducts([]);
    };

    const renderAdminControls = (product) => (
        <div className="flex gap-2 mt-3">
            <Button icon="pi pi-trash" severity="danger" onClick={(e) => {
                e.stopPropagation();
                handleDelete(product._id);
            }} />
            <Button icon="pi pi-refresh" severity="info" onClick={(e) => {
                e.stopPropagation();
                handleToggleAvailable(product._id);
            }} />
        </div>
    );

    if (isLoading) return <div className="p-4 text-center text-xl">טוען מוצרים...</div>;
    if (isError) return <div className="p-4 text-center text-red-500">שגיאה: {error?.message}</div>;

    return (
        <div className="w-screen max-w-none px-6 py-12" style={{ background: 'linear-gradient(135deg, #ecf0f3, #ffffff)' }}>
            <Toast ref={toast} />
            <h1 className="text-center text-5xl font-bold mb-14 text-[#333]">מוצרים</h1>

            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {products.map((product) => (
                    <div
                        key={product._id}
                        onClick={() => toggleProductSelect(product._id, product.isAvailable)}
                        className={`relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer
                        ${selectedProducts.includes(product._id) ? 'border-4 border-green-400 bg-green-50' : ''}`}
                    >
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="rounded-2xl mb-4"
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                        <div className="text-2xl font-semibold text-center mb-1">{product.name}</div>
                        <div className="text-xl text-primary font-medium mb-2">{product.price} ₪</div>
                        <div className={`text-sm font-bold ${product.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                            {product.isAvailable ? 'זמין' : 'לא זמין'}
                        </div>
                        {isAdmin && renderAdminControls(product)}
                    </div>
                ))}
            </div>

            {!isAdmin && (
                <div className="flex justify-center mt-10">
                    <Button
                        label="הוסף לסל"
                        icon="pi pi-shopping-cart"
                        className="p-button-success"
                        onClick={handleAddSelectedToBasket}
                        disabled={selectedProducts.length === 0}
                    />
                </div>
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
                    <InputText id="name" className="w-full" value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                </div>

                {isAdmin && (
                    <div className="field mb-3">
                        <label htmlFor="code" className="block mb-2">קוד מוצר</label>
                        <InputText id="code" className="w-full" value={newProduct.code}
                            onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })} />
                    </div>
                )}

                <div className="field mb-3">
                    <label htmlFor="price" className="block mb-2">מחיר</label>
                    <InputNumber id="price" className="w-full" value={newProduct.price}
                        onValueChange={(e) => setNewProduct({ ...newProduct, price: e.value })} mode="currency" currency="ILS" locale="he-IL" />
                </div>

                <div className="field mb-3">
                    <label htmlFor="imageUrl" className="block mb-2">קישור לתמונה</label>
                    <InputText id="imageUrl" className="w-full" value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })} />
                </div>

                <div className="field mb-3 flex align-items-center gap-2">
                    <Checkbox inputId="isAvailable" checked={newProduct.isAvailable}
                        onChange={(e) => setNewProduct({ ...newProduct, isAvailable: e.checked })} />
                    <label htmlFor="isAvailable">זמין</label>
                </div>
            </Dialog>
        </div>
    );
}
