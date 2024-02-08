import React, { useState, useEffect } from 'react';
import { IoIosVolumeHigh } from 'react-icons/io';
import useDevices from '../../hooks/useDevices';

export default function SpeakerSelector({
  cameraPublishing,
  changeAudioOutput,
  getCurrentAudioOutput,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { deviceInfo } = useDevices();
  const [devicesAvailable, setDevicesAvailable] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setDevicesAvailable(deviceInfo.audioOutputDevices || []);

    if (cameraPublishing && devicesAvailable.length) {
      getCurrentAudioOutput().then((id) => {
        const deviceIndex = devicesAvailable.findIndex((device) => device.deviceId === id);
        setSelectedIndex(deviceIndex !== -1 ? deviceIndex : 0);
      });
    }
  }, [cameraPublishing, deviceInfo.audioOutputDevices]);

  const handleChangeAudioOutput = (index) => {
    const audioOutputId = devicesAvailable[index].deviceId;
    changeAudioOutput(audioOutputId);
    setSelectedIndex(index);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 text-xl text-gray-600 hover:text-gray-800"
        aria-label="Change Audio Output"
      >
        <IoIosVolumeHigh />
      </button>
      {showDropdown && (
        <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
          <ul className="py-1">
            {devicesAvailable.map((device, index) => (
              <li
                key={device.deviceId}
                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                  index === selectedIndex ? 'bg-gray-100' : ''
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
