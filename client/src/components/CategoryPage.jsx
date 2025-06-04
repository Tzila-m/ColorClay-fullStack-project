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

import '../css/Category.css'

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

    if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>טוען קטגוריות...</div>;
    if (isError) return <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>שגיאה: {error?.message}</div>;

    // סגנון לקטנים יותר וכפתורים ליד זה עם זה
    const buttonContainerStyle = {
        display: 'flex',
        gap: '0.5rem',
        justifyContent: 'flex-end',
        marginTop: '1rem'
    };

    const buttonStyle = {
        fontSize: '0.8rem',
        padding: '0.3rem 0.6rem',
        minWidth: 'auto'
    };

    return (
        <div style={{ padding: '2rem' }}>
            <Toast ref={toast} />
            <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '2rem', color: '#4d3c2d' }}>קטגוריות</h1>

            <div className="category-grid">
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className="category-card"
                        onClick={() => handleCategoryClick(category._id)}
                    >
                        <img
                            src="/pictures/categories.png"
                            alt={category.name}
                            style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                marginBottom: '1rem'
                            }}
                        />
                        <div className="bottom-row">
                            <h3 style={{ fontSize: '1.25rem', color: '#6c4e3d' }}>{category.name}</h3>
                            {isAdmin && (
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-rounded p-button-danger p-button-sm delete-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(category);
                                    }}
                                />
                            )}
                        </div>
                    </div>

                ))}
            </div>

            {isAdmin && (
                <Button
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-success"
                    style={{ position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px' }}
                    onClick={() => setShowAddDialog(true)}
                />
            )}

            <Dialog
                header="הוספת קטגוריה חדשה"
                visible={showAddDialog}
                style={{ width: '350px' }}
                onHide={() => setShowAddDialog(false)}
                footer={
                    <div style={buttonContainerStyle}>
                        <Button
                            label="ביטול"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => setShowAddDialog(false)}
                            style={buttonStyle}
                        />
                        <Button
                            label="שמור"
                            icon="pi pi-check"
                            className="p-button-primary"
                            onClick={handleAddCategory}
                            style={buttonStyle}
                        />
                    </div>
                }
            >
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-2 text-right font-semibold">שם הקטגוריה</label>
                    <InputText
                        id="name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        className="w-full"
                        placeholder="לדוגמה: כוסות, צלחות..."
                    />
                </div>
            </Dialog>

            <Dialog
                header="אישור מחיקה"
                visible={showDeleteDialog}
                style={{ width: '30vw' }}
                onHide={() => setShowDeleteDialog(false)}
                footer={
                    <div style={buttonContainerStyle}>
                        <Button
                            label="ביטול"
                            icon="pi pi-times"
                            onClick={() => setShowDeleteDialog(false)}
                            className="p-button-text"
                            style={buttonStyle}
                        />
                        <Button
                            label="מחק"
                            icon="pi pi-trash"
                            onClick={confirmDelete}
                            severity="danger"
                            style={buttonStyle}
                        />
                    </div>
                }
            >
                <p>האם אתה בטוח שברצונך למחוק את הקטגוריה "{selectedCategory?.name}"?</p>
            </Dialog>
        </div>
    );
}
