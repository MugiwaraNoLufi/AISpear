import React from 'react';
import { FaDesktop, FaStop } from 'react-icons/fa'; // FontAwesome Icons

export default function ScreenSharingButton({
  isScreenSharing,
  startScreenSharing,
  stopScreenSharing
}) {
  const handleScreenSharing = () => {
    isScreenSharing ? stopScreenSharing() : startScreenSharing();
  };

  const title = isScreenSharing ? 'Stop Screensharing' : 'Start Screensharing';

  return (
    <div className="tooltip" data-tip={title}>
      <button
        type="button"
        onClick={handleScreenSharing}
        className={`p-2 text-black hover:text-gray-700 rounded-full hover:bg-white transition duration-200 ${
          isScreenSharing ? 'bg-blue-600 text-white' : 'bg-gray-200'
        }`}
      >
        {isScreenSharing ? (
          <FaStop className="h-6 w-6" />
        ) : (
          <FaDesktop className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
