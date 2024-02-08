import { useState } from "react";
import useSignal from "../../hooks/useSignal";
import { FaRegSmile, FaThumbsUp, FaThumbsDown, FaHeart } from "react-icons/fa"; // FontAwesome icons

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
          className="p-2 text-black transition duration-200 bg-gray-200 rounded-full hover:text-gray-700 hover:bg-white"
          id="menu-button"
          aria-expanded={open}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <FaRegSmile className="w-5 h-5 text-gray-700" aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div
          className="top-[-10rem] absolute right-[-6rem] mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="py-1" role="none">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-0"
              onClick={() => {
                sendSignal("thumbsup", "emoji");
                handleClose();
              }}
            >
              <FaThumbsUp className="inline w-5 h-5 mr-2" aria-hidden="true" />{" "}
              Thumbs Up
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-1"
              onClick={() => {
                sendSignal("thumbsdown", "emoji");
                handleClose();
              }}
            >
              <FaThumbsDown
                className="inline w-5 h-5 mr-2"
                aria-hidden="true"
              />{" "}
              Thumbs Down
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-2"
              onClick={() => {
                sendSignal("love", "emoji");
                handleClose();
              }}
            >
              <FaHeart className="inline w-5 h-5 mr-2" aria-hidden="true" />{" "}
              Love
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
