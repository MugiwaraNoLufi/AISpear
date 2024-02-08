import React, { useState } from 'react';
import { FaCopy, FaEllipsisH, FaHome, FaChild } from 'react-icons/fa'; // FontAwesome icons
import { MdQrCode2 } from 'react-icons/md'; // Material Design icon
import QRCode from 'qrcode.react';

const MeetingInfo = ({ roomId }) => {
  const [title, setTitle] = useState('Copy');

  const handleClick = () => {
    setTitle('Copied');
    navigator.clipboard.writeText(window.location.href);
  };

  const handleClose = () => {
    setTimeout(() => {
      setTitle('Copy');
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div>
        <h5 className="text-lg font-bold">Joining info</h5>
        <p>{window.location.href}</p>
        <button
          onClick={handleClick}
          onMouseOut={handleClose}
          className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Copy URL
          <FaCopy className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
        </button>
        <div className="mt-2">
          <QRCode value={window.location.href} />
        </div>
      </div>

      <div>
        <h5 className="text-lg font-bold">App info</h5>
        <div className="flex items-center">
          <FaEllipsisH className="h-5 w-5" />
          <p className="ml-2">Version {process.env.REACT_APP_VERSION}</p>
        </div>
        <a href="https://github.com/nexmo-se/video-api-multiparty-sdk-sample-app" target="_blank" rel="noopener noreferrer" className="flex items-center mt-2">
          <FaHome className="h-5 w-5" />
          <span className="ml-2">Source code</span>
        </a>
        <a href="https://www.npmjs.com/package/@vonage/video-express" target="_blank" rel="noopener noreferrer" className="flex items-center mt-2">
          <FaChild className="h-5 w-5" />
          <span className="ml-2">Video Express</span>
        </a>
      </div>

      <div>
        <h5 className="text-lg font-bold">Session info</h5>
        <p>Session Id: {roomId}</p>
      </div>
    </div>
  );
};

export default MeetingInfo;
