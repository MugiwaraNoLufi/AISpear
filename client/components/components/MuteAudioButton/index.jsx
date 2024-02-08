import { useState, useRef, useEffect } from 'react';
import { IoMic } from 'react-icons/io5';
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMicOff } from "react-icons/io5";

import useDevices from '../../hooks/useDevices';


export default function MuteAudioButton({
  toggleAudio,
  hasAudio,
  getAudioSource,
  cameraPublishing,
  changeAudioSource,
}) {
  const [devicesAvailable, setDevicesAvailable] = useState(null);
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [audioDeviceId, setAudioDeviceId] = useState('');

  const { deviceInfo } = useDevices();

  useEffect(() => {
    setDevicesAvailable(deviceInfo.audioInputDevices);

    if (cameraPublishing && devicesAvailable) {
      getAudioSource().then((id) => setAudioDeviceId(id));

      const indexOfSelectedElement = devicesAvailable.findIndex((e) => e.deviceId === audioDeviceId);
      setSelectedIndex(indexOfSelectedElement);
    }
  }, [cameraPublishing, getAudioSource, deviceInfo, audioDeviceId, devicesAvailable]);

  useEffect(() => {
    if (devicesAvailable) {
      const audioDevicesAvailable = devicesAvailable.map((e) => e.label);
      setOptions(audioDevicesAvailable);
    }
  }, [devicesAvailable]);

  const handleChangeAudioSource = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
    const deviceId = devicesAvailable.find((device) => device.label === event.target.textContent).deviceId;
    changeAudioSource(deviceId);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <div className="flex items-center">
      <button
        onClick={toggleAudio}
        className={`p-2 rounded-full ${hasAudio ? 'bg-blue-500' : 'bg-gray-200'} focus:outline-none focus:ring focus:border-blue-300`}
      >
        {hasAudio ? <IoMic className="text-lg" /> : <IoMicOff className="text-lg" />}
      </button>
      <button
        ref={anchorRef}
        onClick={handleToggle}
        className=" rounded-full bg-gray-200 focus:outline-none focus:ring focus:border-blue-300"
      >
        <IoMdArrowDropdown className="text-lg" />
      </button>
      {open && (
        <div className="absolute z-50 bg-white border border-gray-200 rounded-md shadow-lg">
          <ul>
            {options.map((option, index) => (
              <li
                key={option}
                className={`p-2 hover:bg-gray-100 ${index === selectedIndex ? 'bg-gray-200' : ''}`}
                onClick={(event) => handleChangeAudioSource(event, index)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
