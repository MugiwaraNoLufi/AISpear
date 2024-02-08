import React from "react";

const YourMessage = ({ messageContent, index, timestamp, username }) => {
  return (
    <div className="flex flex-row items-center">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
        A
      </div>
      <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
        <div>Hey How are you today?</div>
      </div>
    </div>
  );
};

export default YourMessage;
