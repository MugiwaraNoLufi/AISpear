import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';

const ChatInput = ({ sendMessage }) => {
  const [text, setText] = useState('');

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      sendMessage(text);
      setText('');
    }
  };

  const changeText = (event) => {
    setText(event.target.value);
  };
  
  return (
    <form className="flex items-center" noValidate autoComplete="off">
      <input
        type="text"
        onChange={changeText}
        onKeyDown={onKeyDown}
        value={text}
        placeholder="Chat"
        className="flex-1 p-2 border border-gray-300 rounded mr-2"
      />
      <button
        onClick={() => {
          sendMessage(text);
          setText('');
        }}
        type="button"
        className="flex items-center justify-center p-2 bg-blue-500 text-white rounded"
      >
        <IoSend />
      </button>
    </form>
  );
};

export default ChatInput;
