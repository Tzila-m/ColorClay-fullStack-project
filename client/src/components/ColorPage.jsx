import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  useGetAllColorsQuery,
  useDeleteColorMutation,
  useUpdateAvailableColorMutation,
  useCreateColorMutation
} from '../features/colorApiSlice'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import ColorCard from './ColorCard'

import { addColor } from '../features/basketApiSlice'

const ColorPage = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const isAdmin = user?.roles === 'admin'
  const { data: colors = [], isLoading, isError } = useGetAllColorsQuery(undefined, {
    pollingInterval: 5000
  })
  const [deleteColor] = useDeleteColorMutation()
  const [updateAvailableColor] = useUpdateAvailableColorMutation()
  const [createColor] = useCreateColorMutation()

  const [selectedColors, setSelectedColors] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newColor, setNewColor] = useState({ name: '', code: '', imageUrl: '' })

  const toggleColorSelect = (colorId, isAvailable) => {
    if (!isAvailable) {
      alert('הצבע לא זמין כעת')
      return
    }
    setSelectedColors((prev) =>
      prev.includes(colorId) ? prev.filter(id => id !== colorId) : [...prev, colorId]
    )
  }

  const handleDelete = async (id) => {
    if (window.confirm('בטוח/ה שברצונך למחוק את הצבע?')) {
      try {
        await deleteColor(id).unwrap()
      } catch (err) {
        console.error('שגיאה במחיקה:', err)
        alert('אירעה שגיאה במחיקת הצבע')
      }
    }
  }

  const handleToggleAvailable = async (id) => {
    try {
      await updateAvailableColor(id).unwrap()
    } catch (err) {
      console.error('שגיאה בעדכון זמינות:', err)
      alert('אירעה שגיאה בעדכון הזמינות')
    }
  }

  const handleAddNewColor = async (e) => {
    e.preventDefault()
    if (!newColor.name || !newColor.code) {
      alert('נא למלא שם וקוד צבע')
      return
    }
    try {
      await createColor(newColor).unwrap()
      setShowAddForm(false)
      setNewColor({ name: '', code: '', imageUrl: '' })
    } catch (err) {
      alert(err?.data?.message || 'אירעה שגיאה ביצירת הצבע')
    }
  }

  const handleAddSelectedColorsToBasket = () => {
    selectedColors.forEach(colorId => {
      const color = colors.find(c => c._id === colorId)
      if (color) {
        dispatch(addColor(color))
      }
    })
    alert('הצבעים נוספו בהצלחה לסל')
    setSelectedColors([])
  }

  if (isLoading) return <div className="p-4">טוען צבעים...</div>
  if (isError) return <div className="p-4 text-red-500">שגיאה בטעינת צבעים</div>

  return (
    <div className="p-6 max-w-6xl mx-auto">
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
          >
            <form onSubmit={handleAddNewColor}>
              <label className="block mb-2">שם צבע:</label>
              <input
                type="text"
                value={newColor.name}
                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                required
                className="p-inputtext w-full mb-4"
              />

              <label className="block mb-2">קוד צבע (למשל A1):</label>
              <input
                type="text"
                value={newColor.code}
                onChange={(e) => setNewColor({ ...newColor, code: e.target.value })}
                required
                className="p-inputtext w-full mb-4"
              />

              <label className="block mb-2">קישור לתמונה (URL):</label>
              <input
                type="text"
                value={newColor.imageUrl}
                onChange={(e) => setNewColor({ ...newColor, imageUrl: e.target.value })}
                placeholder="אופציונלי"
                className="p-inputtext w-full mb-4"
              />

              <div className="flex justify-end gap-2">
                <Button label="הוסף צבע" type="submit" className="p-button-success" />
              </div>
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
  )
}

export default ColorPage
