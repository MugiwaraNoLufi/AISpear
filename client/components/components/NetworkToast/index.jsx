import React, { useState, useEffect } from 'react';
import {FaCheckCircle , FaTimesCircle, FaWifi, FaRoute } from 'react-icons/fa';

export default function NetworkToast({ networkStatus }) {
  const [open, setOpen] = useState(Boolean(networkStatus));

  const getIcon = () => {
    switch (networkStatus) {
      case 'reconnected':
        return <FaCheckCircle className="h-6 w-6 text-green-500" />;
      case 'reconnecting':
        return <FaTimesCircle className="h-6 w-6 text-yellow-500" />;
      default:
        return <FaWifi className="h-6 w-6 text-red-500" />;
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOpen(Boolean(networkStatus));
  }, [networkStatus]);

  const getMessage = () => {
    return networkStatus === 'reconnecting'
      ? 'You are disconnected. Please check your internet connection'
      : `You have been ${networkStatus}`;
  };

  return (
    <div className={`fixed top-0 inset-x-0 p-2 transition transform ease-in-out duration-300 ${open ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="bg-white shadow-lg rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center">
          {getIcon()}
          <span className="ml-3">{getMessage()}</span>
        </div>
        <button onClick={handleClose}>
          <FaRoute className="h-6 w-6 text-gray-600 hover:text-gray-800" />
        </button>
      </div>
    </div>
  );
}
