import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  useGetAllColorsQuery,
  useDeleteColorMutation,
  useUpdateAvailableColorMutation,
  useCreateColorMutation
} from '../features/colorApiSlice';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import ColorCard from './ColorCard';
import { addColor } from '../features/basketApiSlice';

const ColorPage = () => {
  const dispatch = useDispatch();
  const toast = useRef(null);
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.roles === 'admin';

  const { data: colors = [], isLoading, isError } = useGetAllColorsQuery(undefined, {
    pollingInterval: 5000
  });

  const [deleteColor] = useDeleteColorMutation();
  const [updateAvailableColor] = useUpdateAvailableColorMutation();
  const [createColor] = useCreateColorMutation();

  const [selectedColors, setSelectedColors] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newColor, setNewColor] = useState({ name: '', code: '', imageUrl: '' });

  const toggleColorSelect = (colorId, isAvailable) => {
    if (!isAvailable) {
      toast.current.show({
        severity: 'warn',
        summary: 'המוצר אינו זמין כעת',
        detail: '',
        life: 3000
      });
      return;
    }
    setSelectedColors((prev) =>
      prev.includes(colorId) ? prev.filter(id => id !== colorId) : [...prev, colorId]
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm('בטוח/ה שברצונך למחוק את הצבע?')) {
      try {
        await deleteColor(id).unwrap();
        toast.current.show({
          severity: 'success',
          summary: 'המוצר נמחק בהצלחה',
          detail: '',
          life: 3000
        });
      } catch {
        toast.current.show({
          severity: 'error',
          summary: 'שגיאה במחיקת המוצר',
          detail: '',
          life: 3000
        });
      }
    }
  };

  const handleToggleAvailable = async (id) => {
    try {
      await updateAvailableColor(id).unwrap();
      toast.current.show({
        severity: 'success',
        summary: 'זמינות המוצר עודכנה',
        detail: '',
        life: 3000
      });
    } catch {
      toast.current.show({
        severity: 'error',
        summary: 'שגיאה בעדכון זמינות',
        detail: '',
        life: 3000
      });
    }
  };

  const handleAddNewColor = async (e) => {
    e.preventDefault();
    if (!newColor.name || !newColor.code) {
      toast.current.show({
        severity: 'warn',
        summary: 'אנא מלא את כל השדות',
        detail: '',
        life: 3000
      });
      return;
    }

    try {
      await createColor(newColor).unwrap();
      setShowAddForm(false);
      setNewColor({ name: '', code: '', imageUrl: '' });
      toast.current.show({
        severity: 'success',
        summary: 'המוצר נוסף בהצלחה',
        detail: '',
        life: 3000
      });
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: err?.data?.message || 'שגיאה בהוספת מוצר',
        detail: '',
        life: 3000
      });
    }
  };

  const handleAddSelectedColorsToBasket = () => {
    selectedColors.forEach(colorId => {
      const color = colors.find(c => c._id === colorId);
      if (color) {
        dispatch(addColor(color));
      }
    });

    toast.current.show({
      severity: 'success',
      summary: 'המוצרים נוספו לסל',
      detail: '',
      life: 3000
    });

    setSelectedColors([]);
  };

  if (isLoading) return <div className="p-4">טוען צבעים...</div>;
  if (isError) return <div className="p-4 text-red-500">שגיאה בטעינת צבעים</div>;
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewColor({ ...newColor, imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Toast ref={toast} position="top-right" />

      {!isAdmin && (
        <h2 className="text-3xl font-semibold mb-6">בחר צבעים</h2>
      )}

      {isAdmin && (
        <>
          <Button
            label="הוסף צבע חדש"
            icon="pi pi-plus"
            className="p-button-info mb-6"
            onClick={() => setShowAddForm(true)}
          />

          <Dialog
            header="הוספת צבע חדש"
            visible={showAddForm}
            style={{ width: '400px' }}
            modal
            onHide={() => setShowAddForm(false)}
            footer={
              <div className="flex justify-end gap-2">
                <Button
                  label="ביטול"
                  icon="pi pi-times"
                  className="p-button-text"
                  onClick={() => setShowAddForm(false)}
                />
                <Button
                  label="הוסף צבע"
                  icon="pi pi-check"
                  type="submit"
                  form="addColorForm"
                  className="p-button-success"
                />
              </div>
            }
          >
            <form id="addColorForm" onSubmit={handleAddNewColor}>
              <label className="block mb-2">שם צבע:</label>
              <input
                type="text"
                value={newColor.name}
                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                required
                className="p-inputtext w-full mb-4"
              />

              <label className="block mb-2">קוד צבע:</label>
              <input
                type="text"
                value={newColor.code}
                onChange={(e) => setNewColor({ ...newColor, code: e.target.value })}
                required
                className="p-inputtext w-full mb-4"
              />

              <label className="block mb-2">תמונה מהמחשב:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="p-inputtext w-full mb-4"
              />

              {newColor.imageUrl && (
                <img src={newColor.imageUrl} alt="preview" className="h-32 object-contain mt-2" />
              )}
            </form>
          </Dialog>
        </>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {colors.map(color => (
          <ColorCard
            key={color._id}
            color={color}
            isSelected={selectedColors.includes(color._id)}
            isAdmin={isAdmin}
            toggleColorSelect={toggleColorSelect}
            handleDelete={handleDelete}
            handleToggleAvailable={handleToggleAvailable}
          />
        ))}
      </div>

      {!isAdmin && (
        <Button
          label="הוסף לסל"
          icon="pi pi-shopping-cart"
          className="p-button-success"
          onClick={handleAddSelectedColorsToBasket}
          disabled={selectedColors.length === 0}
        />
      )}
    </div>
  );
};

export default ColorPage;
