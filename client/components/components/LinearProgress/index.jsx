// LinearProgress.js

import React from "react";

const LinearProgress = ({ variant, value }) => {
  let progressColorClass = "";

  // Determine the color class based on the variant
  if (variant === "determinate") {
    // Add your color classes for determinate progress
    progressColorClass = "bg-blue-500"; // You can customize this color
  } else {
    // Add your color classes for indeterminate progress
    progressColorClass = "bg-blue-500"; // You can customize this color
  }

  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div className={`h-full ${progressColorClass}`} style={{ width: `${value}%` }}></div>
    </div>
  );
};

export default LinearProgress;
