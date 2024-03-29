import React, { useState } from "react";
import { FaTh, FaUserCircle } from "react-icons/fa";

export default function LayoutButton({ room }) {
  const [layOut, setLayOut] = useState("grid");
  const [showMenu, setShowMenu] = useState(false);

  const handleLayOutChange = (newLayout) => {
    if (room) {
      room.setLayoutMode(newLayout);
      setLayOut(newLayout);
      setShowMenu(false);
    }
  };

  return (
    <div className="reletive">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 text-black transition duration-200 bg-gray-200 rounded-full hover:text-gray-700 hover:bg-white"
      >
        <FaTh />
      </button>
      {showMenu && (
        <div className="absolute flex flex-col gap-3 bg-white top-[39rem] right-[-3.25rem]">
          <div
            className={`menu-item flex flex-row gap-3 items-center justify-even ${
              layOut === "grid" ? "active" : ""
            }`}
            onClick={() => handleLayOutChange("grid")}
          >
            <FaTh className="text-gray-400" />
            <span className="text-gray-400">Grid</span>
          </div>
          <div
            className={`menu-item flex flex-row gap-3 items-center justify-even ${
              layOut === "active-speaker" ? "active" : ""
            }`}
            onClick={() => handleLayOutChange("active-speaker")}
          >
            <FaUserCircle />
            <span className="text-gray-400">Active Speaker</span>
          </div>
        </div>
      )}
    </div>
  );
}
