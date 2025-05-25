import React from 'react'
import { Button } from 'primereact/button'

const ColorCard = ({
  color,
  isSelected,
  isAdmin,
  toggleColorSelect,
  handleDelete,
  handleToggleAvailable
}) => {
  const isDisabled = !isAdmin && !color.isAvailable

  const cardClass = `
    color-card
    ${isSelected ? 'selected' : ''}
    ${isDisabled ? 'disabled' : ''}
  `

  return (
    <div
      key={color._id}
      className={cardClass}
      onClick={() => {
        if (!isAdmin) {
          toggleColorSelect(color._id, color.isAvailable)
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (!isAdmin && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          toggleColorSelect(color._id, color.isAvailable)
        }
      }}
    >
      {isAdmin && (
        <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
          <Button
            icon="pi pi-trash"
            className="p-button-danger p-button-sm"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(color._id)
            }}
            aria-label="מחיקת צבע"
          />
          <Button
            icon="pi pi-refresh"
            className={`p-button-sm ${color.isAvailable ? 'p-button-warning' : 'p-button-success'}`}
            onClick={(e) => {
              e.stopPropagation()
              handleToggleAvailable(color._id)
            }}
            tooltip={color.isAvailable ? 'סמן כלא זמין' : 'סמן כזמין'}
            tooltipOptions={{ position: 'top' }}
            aria-label="עדכון זמינות צבע"
          />
        </div>
      )}

      <img
        src={color.imageUrl}
        alt={color.name}
        style={{ filter: isDisabled ? 'brightness(85%)' : 'none' }}
      />

      <div className="color-name">{color.name}</div>
      <div className="color-code">{color.code}</div>

      {/* תוספת: טקסט זמינות גם למנהל */}
      {(isAdmin || !isAdmin) && (
        <div className={`availability ${color.isAvailable ? 'available' : 'unavailable'}`}>
          {color.isAvailable ? 'זמין' : 'לא זמין'}
        </div>
      )}
    </div>
  )
}

export default ColorCard
