import React from 'react'
import { Button } from 'primereact/button'

const ProductCard = ({
  product,
  isSelected,
  isAdmin,
  onClick,
  onDelete,
  onToggleAvailable
}) => {
  const isDisabled = !isAdmin && !product.isAvailable

  const cardClass = `
    color-card
    ${isSelected ? 'selected' : ''}
    ${isDisabled ? 'disabled' : ''}
  `

  const handleCardClick = () => {
    if (!isAdmin && onClick) {
      onClick(product._id, product.isAvailable)
    }
  }

  return (
    <div
      className={cardClass}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (!isAdmin && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleCardClick()
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
              onDelete(product._id)
            }}
            aria-label="מחיקת מוצר"
          />
          <Button
            icon="pi pi-refresh"
            className={`p-button-sm ${product.isAvailable ? 'p-button-warning' : 'p-button-success'}`}
            onClick={(e) => {
              e.stopPropagation()
              onToggleAvailable(product._id)
            }}
            tooltip={product.isAvailable ? 'סמן כלא זמין' : 'סמן כזמין'}
            tooltipOptions={{ position: 'top' }}
            aria-label="עדכון זמינות מוצר"
          />
        </div>
      )}

      <img
        src={product.imageUrl}
        alt={product.name}
        style={{ filter: isDisabled ? 'brightness(85%)' : 'none' }}
      />

      <div className="color-name">{product.name}</div>
      <div className="color-code">{product.price} ₪</div>

      <div className={`availability ${product.isAvailable ? 'available' : 'unavailable'}`}>
        {product.isAvailable ? 'זמין' : 'לא זמין'}
      </div>
    </div>
  )
}

export default ProductCard
