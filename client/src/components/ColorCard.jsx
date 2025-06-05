import React from 'react';
import { Button } from 'primereact/button';

const ColorCard = ({
  color,
  isSelected,
  isAdmin,
  onClick,
  onDelete,
  onToggleAvailable
}) => {
  const isDisabled = !isAdmin && !color.isAvailable;

  const handleCardClick = () => {
    if (!isAdmin && onClick) {
      onClick(color._id, color.isAvailable);
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
        src={color.imageUrl}
        alt={color.name}
        className="color-image"
      />


      <div className="bottom-row">
        <h3>{color.name}</h3>
        {isAdmin && (
          <div className="admin-actions">
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger p-button-sm action-button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(color._id);
              }}
            />
            <Button
              icon={color.isAvailable ? 'pi pi-check-circle' : 'pi pi-times-circle'}
              className={`p-button-rounded p-button-sm action-button ${color.isAvailable ? 'p-button-success' : 'p-button-warning'}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleAvailable(color._id);
              }}
            />
          </div>
        )}
        <div className={`product-availability ${color.isAvailable ? 'available' : 'not-available'}`}>
          {color.isAvailable ? 'זמין' : 'לא זמין'}
        </div>
      </div>
    </div>
  );
};

export default ColorCard;
