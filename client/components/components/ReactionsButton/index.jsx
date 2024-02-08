import { useState } from 'react';
import useSignal from '../../hooks/useSignal';
import { FaRegSmile, FaThumbsUp, FaThumbsDown, FaHeart } from 'react-icons/fa'; // FontAwesome icons

export default function ReactionsButton({ room }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { sendSignal } = useSignal({ room });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          id="menu-button"
          aria-expanded={open}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <FaRegSmile className="h-5 w-5 text-gray-700" aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
          <div className="py-1" role="none">
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-0"
              onClick={() => { sendSignal('thumbsup', 'emoji'); handleClose(); }}
            >
              <FaThumbsUp className="h-5 w-5 mr-2 inline" aria-hidden="true" /> Thumbs Up
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-1"
              onClick={() => { sendSignal('thumbsdown', 'emoji'); handleClose(); }}
            >
              <FaThumbsDown className="h-5 w-5 mr-2 inline" aria-hidden="true" /> Thumbs Down
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-2"
              onClick={() => { sendSignal('love', 'emoji'); handleClose(); }}
            >
              <FaHeart className="h-5 w-5 mr-2 inline" aria-hidden="true" /> Love
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
