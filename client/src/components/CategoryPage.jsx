import React, { useState, useRef } from 'react';
import {
    useGetAllCategoriesQuery,
    useDeleteCategoryMutation,
    useCreateCategoryMutation
} from '../features/categoryApiSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';

export default function CategoryPage() {
    const { data: categories = [], isLoading, isError, error } = useGetAllCategoriesQuery();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [createCategory] = useCreateCategoryMutation();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '' });

    const toast = useRef(null);
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);
    const isAdmin = user?.roles === 'admin';

    const handleCategoryClick = (categoryId) => {
        navigate(`/product/${categoryId}`);
    };

    const handleDeleteClick = (category) => {
        setSelectedCategory(category);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (selectedCategory) {
            try {
                await deleteCategory(selectedCategory._id).unwrap();
                toast.current.show({ severity: 'success', summary: 'נמחק בהצלחה', life: 3000 });
            } catch {
                toast.current.show({ severity: 'error', summary: 'שגיאה במחיקה', life: 3000 });
            } finally {
                setShowDeleteDialog(false);
            }
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.name.trim()) {
            toast.current.show({ severity: 'warn', summary: 'יש למלא שם קטגוריה', life: 3000 });
            return;
        }
        try {
            await createCategory(newCategory).unwrap();
            toast.current.show({ severity: 'success', summary: 'קטגוריה נוספה', life: 3000 });
            setNewCategory({ name: '' });
            setShowAddDialog(false);
        } catch {
            toast.current.show({ severity: 'error', summary: 'שגיאה בהוספה', life: 3000 });
        }
    };

    if (isLoading) return <div className="p-4 text-center text-xl">טוען קטגוריות...</div>;
    if (isError) return <div className="p-4 text-center text-red-500">שגיאה: {error?.message}</div>;

    return (
        <div className="w-screen max-w-none px-6 py-12" style={{ background: 'linear-gradient(135deg, #fde7e7, #fff2ec)' }}>
            <Toast ref={toast} />
            <h1 className="text-center text-5xl font-bold mb-14 text-[#4d3c2d]">
                קטגוריות
            </h1>

            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className="relative cursor-pointer bg-white rounded-3xl shadow-lg hover:shadow-2xl transition p-6 flex flex-col items-center hover:scale-105 transition-transform"
                        onClick={() => handleCategoryClick(category._id)} 
                    >
                        {isAdmin && (
                            <Button
                                icon="pi pi-trash"
                                className="p-button-sm p-button-rounded p-button-danger absolute top-3 left-3"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(category);
                                }}
                            />
                        )}
                        <div className="w-full flex flex-col items-center">
                            <img
                                src="/pictures/categories.png"
                                alt={category.name}
                                className="rounded-2xl mb-6"
                                style={{
                                    width: '100%',
                                    height: '260px',
                                    objectFit: 'cover',
                                    borderRadius: '1.5rem',
                                }}
                            />
                            <div className="text-3xl font-semibold text-[#5c4033] text-center">
                                {category.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isAdmin && (
                <Button
                    icon="pi pi-plus"
                    label=""
                    className="p-button-rounded p-button-success fixed bottom-6 right-6 shadow-3 z-50"
                    onClick={() => setShowAddDialog(true)}
                    tooltip="הוסף קטגוריה"
                    tooltipOptions={{ position: 'top' }}
                    style={{ width: '3.5rem', height: '3.5rem' }}
                />
            )}

            {/* דיאלוג הוספה */}
            <Dialog
                header="הוספת קטגוריה חדשה"
                visible={showAddDialog}
                style={{ width: '350px' }}
                onHide={() => setShowAddDialog(false)}
                footer={
                    <div>
                        <Button label="ביטול" icon="pi pi-times" className="p-button-text" onClick={() => setShowAddDialog(false)} />
                        <Button label="שמור" icon="pi pi-check" className="p-button-primary" onClick={handleAddCategory} />
                    </div>
                }
            >
                <div className="field mb-4">
                    <label htmlFor="name" className="block mb-2 text-right">שם הקטגוריה</label>
                    <InputText
                        id="name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        className="w-full"
                        placeholder="לדוגמה: כלי אוכל"
                    />
                </div>
            </Dialog>

            {/* דיאלוג מחיקה */}
            <Dialog
                header="אישור מחיקה"
                visible={showDeleteDialog}
                style={{ width: '30vw' }}
                onHide={() => setShowDeleteDialog(false)}
                footer={
                    <div>
                        <Button label="ביטול" icon="pi pi-times" onClick={() => setShowDeleteDialog(false)} className="p-button-text" />
                        <Button label="מחק" icon="pi pi-trash" onClick={confirmDelete} severity="danger" />
                    </div>
                }
            >
                <p>האם אתה בטוח שברצונך למחוק את הקטגוריה "{selectedCategory?.name}"?</p>
            </Dialog>
        </div>
    );
}
