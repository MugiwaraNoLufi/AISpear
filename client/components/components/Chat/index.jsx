import React from 'react';
import ChatInput from '../ChatInput';
import useSignal from '../../hooks/useSignal';
import ChatMessages from '../ChatMessages';

const Chat = ({ room, listOfMessages }) => {
  const { sendSignal } = useSignal({ room });

  const sendMessage = (text) => {
    if (room) sendSignal(text, 'text');
  };

  return (
    <div className="flex flex-col h-full">
      <ChatMessages chatMessages={listOfMessages} className="flex-1 overflow-y-auto" />
      <div className="bg-gray-100 p-4">
        <ChatInput sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default Chat;
