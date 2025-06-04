import React from 'react';
import { Button } from 'primereact/button';

const ProductCard = ({
  product,
  isSelected,
  isAdmin,
  onClick,
  onDelete,
  onToggleAvailable
}) => {
  const isDisabled = !isAdmin && !product.isAvailable;

  const handleCardClick = () => {
    if (!isAdmin && onClick) {
      onClick(product._id, product.isAvailable);
    }
  };

  return (
    <div
      className={`product-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (!isAdmin && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="product-image"
        style={{ filter: isDisabled ? 'grayscale(60%) brightness(90%)' : 'none' }}
      />

      <div className="bottom-row">
        <h3>{product.name}</h3>
        {isAdmin && (
          <div className="admin-actions">
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger p-button-sm action-button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product._id);
              }}
            />
            <Button
              icon={product.isAvailable ? 'pi pi-check-circle' : 'pi pi-times-circle'}
              className={`p-button-rounded p-button-sm action-button ${product.isAvailable ? 'p-button-success' : 'p-button-warning'}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleAvailable(product._id);
              }}
            />

          </div>

        )}
      </div>

      <div className="product-info">
        <div className="product-price">{product.price} ₪</div>
        <div className={`product-availability ${product.isAvailable ? 'available' : 'not-available'}`}>
          {product.isAvailable ? 'זמין' : 'לא זמין'}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
