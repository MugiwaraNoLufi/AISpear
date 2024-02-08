import React, { useState } from 'react';
import { FaRegComment } from 'react-icons/fa';
import SideMenu from '../SideMenu';
import useSignal from '../../hooks/useSignal';
import { MdClose } from 'react-icons/md';

export default function MoreOptionsButton({ participants, room, localParticipant }) {
  const { listOfMessages } = useSignal({ room });
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={toggleDrawer}
        className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
        aria-label="Chat"
      >
        <FaRegComment className="h-6 w-6" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 sm:px-6">
                    <button
                      onClick={toggleDrawer}
                      className="text-gray-300 hover:text-gray-500 transition ease-in-out duration-150"
                      aria-label="Close panel"
                    >
                      <span className="sr-only text-red-500">Closefbdf bfd fdbf panel</span>
                  <MdClose className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="mt-6 relative flex-1 px-4 sm:px-6">
                    <SideMenu
                      room={room}
                      participants={participants}
                      localParticipant={localParticipant}
                      listOfMessages={listOfMessages}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
