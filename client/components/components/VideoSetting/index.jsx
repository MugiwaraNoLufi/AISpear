import React from "react";
import { MdVideocam } from "react-icons/md"; // Using react-icons for Videocam icon

const VideoSettings = React.memo(({ hasVideo, onVideoChange, className }) => {
  // const handleVideoChange = (event) => {
  //   onVideoChange(event.target.checked);
  // };

  return (
    <div className={className}>
      <MdVideocam />
      <div className="text-sm dark:text-white">Video</div>
      <input
        type="checkbox"
        checked={hasVideo}
        onChange={onVideoChange}
        name="VideoToggle"
      />
    </div>
  );
});

export default VideoSettings;
