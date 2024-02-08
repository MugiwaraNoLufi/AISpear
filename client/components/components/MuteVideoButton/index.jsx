import React, { useState, useEffect, useContext, useRef } from 'react';
import { MdVideocam, MdVideocamOff } from 'react-icons/md';
import { HiOutlineArrowCircleDown } from "react-icons/hi";

import useDevices from "../../hooks/useDevices";
import { UserContext } from "../../../app/(root)/context/UserContext"

export default function MuteVideoButton({ hasVideo, toggleVideo, getVideoSource, cameraPublishing, changeVideoSource }) {
  const { deviceInfo } = useDevices();
  const { user } = useContext(UserContext);
  const [devicesAvailable, setDevicesAvailable] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  useEffect(() => {
    setDevicesAvailable(deviceInfo.videoInputDevices || []);
    if (cameraPublishing && devicesAvailable.length > 0) {
      const currentDeviceId = getVideoSource()?.deviceId;
      const IndexOfSelectedElement = devicesAvailable.findIndex((device) => device.deviceId === currentDeviceId);
      setSelectedIndex(IndexOfSelectedElement !== -1 ? IndexOfSelectedElement : 0);
    }
  }, [cameraPublishing, getVideoSource, deviceInfo.videoInputDevices, devicesAvailable]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleChangeVideoSource = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
    const videoDeviceId = devicesAvailable[index].deviceId;
    changeVideoSource(videoDeviceId);
  };

  const handleClose = (event) => {
    if (!anchorRef.current || !anchorRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  return (
    <div className="inline-flex flex-col" ref={anchorRef}>
      <div className="flex items-center">
        <button
          onClick={toggleVideo}
          className={`p-2 ${hasVideo ? 'text-green-500' : 'text-red-500'}`}
          title={hasVideo ? "Disable Camera" : "Enable Camera"}
        >
          {hasVideo ? <MdVideocam size="24" /> : <MdVideocamOff size="24" />}
        </button>
        <button
          onClick={handleToggle}
          className="p-2 text-gray-500"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
       
          <HiOutlineArrowCircleDown size="24" />

        </button>
      </div>
      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1" role="none">
            {devicesAvailable.map((device, index) => (
              <a
                key={device.deviceId}
                href="#"
                className={`block px-4 py-2 text-sm text-gray-700 ${index === selectedIndex ? 'bg-gray-100' : ''}`}
                onClick={(event) => handleChangeVideoSource(event, index)}
              >
                {device.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
