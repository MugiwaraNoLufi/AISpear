import React from "react";
import { MdMic } from "react-icons/md";

const AudioSettings = ({ hasAudio, onAudioChange }) => {
  return (
    <>
      {/* Other components that are used in this component: */}

      <div className="flex items-center mb-4 space-x-3">
        <MdMic className="text-lg text-gray-700" />

        <div className="mt-3 ">
          <label for="AudioToggle" class="text-sm text-gray-700">
            Microphone
          </label>
        </div>

        <div className="flex items-center justify-center">
          <input
            name="AudioToggle"
            id="AudioToggle"
            checked={hasAudio}
            onChange={onAudioChange}
            type="checkbox"
            class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500"
          />
        </div>
      </div>
    </>
  );
};

export default AudioSettings;
