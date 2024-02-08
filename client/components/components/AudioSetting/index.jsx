import React from 'react';
import { MdMic } from 'react-icons/md';

const AudioSettings = ({ hasAudio, onAudioChange }) => {
  return (
    <div className="flex items-center space-x-3">
      <MdMic className="text-lg text-gray-700" />
      <div className="text-sm text-gray-700">Microphone</div>
      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
        <input
          type="checkbox"
          name="AudioToggle"
          id="AudioToggle"
          checked={hasAudio}
          onChange={onAudioChange}
          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
        />
        <label
          htmlFor="AudioToggle"
          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
        ></label>
      </div>
    </div>
  );
};

export default AudioSettings;
