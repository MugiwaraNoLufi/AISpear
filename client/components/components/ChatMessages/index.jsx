import React, { useRef, useEffect } from 'react';
import { RiContactsLine } from 'react-icons/ri';

const ChatMessages = ({ chatMessages, chatClass }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToLastMessage();
  }, [chatMessages]);

  const scrollToLastMessage = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={chatClass}>
      {chatMessages && chatMessages.length > 0 ? (
        chatMessages.map((msg, key) => (
          <div
            ref={messagesEndRef}
            className={`flex items-center mb-2 ${msg?.from?.name ? 'justify-start' : 'justify-end'}`}
            key={key}
          >
            <div className={`flex items-center ${msg?.from?.name ? '' : 'flex-row-reverse'}`}>
              <RiContactsLine className="text-xl text-gray-500 mr-2" />
              <div className="text-sm text-gray-500 mr-2">
                {msg?.from?.name ? `${msg.from.name}:` : 'Me:'}
              </div>
              <div className="text-sm text-gray-500">
                {msg.date}
              </div>
            </div>
            <div className="ml-4">
              <div className="text-base text-gray-700">
                {msg.data}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>There are no messages</div>
      )}
    </div>
  );
};

export default ChatMessages;
