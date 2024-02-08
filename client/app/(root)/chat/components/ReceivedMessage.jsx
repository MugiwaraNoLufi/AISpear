import React from "react";

const ReceivedMessage = ({ messageContent, index, timestamp, username }) => {
  return (
    <div className="flex items-center justify-start flex-row-reverse">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
        A
      </div>
      <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
        <div>I'm ok what about you?</div>
      </div>
    </div>
  );
};

export default ReceivedMessage;
