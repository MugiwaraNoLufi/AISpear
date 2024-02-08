import React, { useState } from 'react';
import { FaTh, FaUserCircle } from 'react-icons/fa';

export default function LayoutButton({ room }) {
  const [layOut, setLayOut] = useState('grid');
  const [showMenu, setShowMenu] = useState(false);

  const handleLayOutChange = (newLayout) => {
    if (room) {
      room.setLayoutMode(newLayout);
      setLayOut(newLayout);
      setShowMenu(false);
    }
  };

  return (
    <div className="layout-button">
      <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-black hover:text-gray-700 bg-gray-200 rounded-full hover:bg-white transition duration-200">
        <FaTh />
      </button>
      {showMenu && (
        <div className="menu">
          <div
            className={`menu-item ${layOut === 'grid' ? 'active' : ''}`}
            onClick={() => handleLayOutChange('grid')}
          >
            <FaTh />
            <span>Grid</span>
          </div>
          <div
            className={`menu-item ${layOut === 'active-speaker' ? 'active' : ''}`}
            onClick={() => handleLayOutChange('active-speaker')}
          >
            <FaUserCircle />
            <span>Active Speaker</span>
          </div>
        </div>
      )}
    </div>
  );
}
