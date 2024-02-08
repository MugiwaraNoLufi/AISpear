import React, { useState, useEffect, useRef } from "react";
import { IoIosVolumeHigh } from "react-icons/io";
import useDevices from "../../hooks/useDevices";

export default function SpeakerSelector({
  cameraPublishing,
  changeAudioOutput,
  getCurrentAudioOutput,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { deviceInfo } = useDevices();
  const [devicesAvailable, setDevicesAvailable] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setDevicesAvailable(deviceInfo.audioOutputDevices || []);

    if (cameraPublishing && devicesAvailable.length) {
      getCurrentAudioOutput().then((id) => {
        const deviceIndex = devicesAvailable.findIndex(
          (device) => device.deviceId === id
        );
        setSelectedIndex(deviceIndex !== -1 ? deviceIndex : 0);
      });
    }
  }, [cameraPublishing, deviceInfo.audioOutputDevices]);

  useEffect(() => {
    // Handle click outside the dropdown to close it
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    // Unbind the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChangeAudioOutput = (index) => {
    const audioOutputId = devicesAvailable[index].deviceId;
    changeAudioOutput(audioOutputId);
    setSelectedIndex(index);
    setShowDropdown(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-3 text-black transition duration-200 bg-gray-200 rounded-full hover:text-gray-700 hover:bg-white"
        aria-label="Change Audio Output"
      >
        <IoIosVolumeHigh />
      </button>
      {showDropdown && (
        <div className="dropdown-menu">
          <ul className="py-1">
            {devicesAvailable.map((device, index) => (
              <li
                key={device.deviceId}
                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                  index === selectedIndex ? "bg-gray-100" : ""
                }`}
                onClick={() => handleChangeAudioOutput(index)}
              >
                {device.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
