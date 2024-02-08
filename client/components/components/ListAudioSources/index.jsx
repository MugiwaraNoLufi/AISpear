import React from 'react';

export default function LayoutOptions({
  handleLayOutChange,
  open,
  handleCloseLayout,
  anchorElLayout
}) {
  const getPosition = () => {
    if (anchorElLayout) {
      const rect = anchorElLayout.getBoundingClientRect();
      return {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      };
    }
    return { top: 0, left: 0 };
  };

  const position = getPosition();

  return (
    <div>
      {open && (
        <div
          className="absolute bg-white border border-gray-300 rounded shadow-lg z-50"
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          onBlur={handleCloseLayout}
          tabIndex={-1}
        >
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleLayOutChange('grid')}
          >
            Grid
          </div>
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleLayOutChange('active-speaker')}
          >
            Active Speaker
          </div>
        </div>
      )}
    </div>
  );
}
