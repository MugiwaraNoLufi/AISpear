import React, { useState } from 'react';
import MeetingInfo from '../MeetingInfo';
import Chat from '../Chat';
import { MdGroup, MdPerson, MdAccessTime } from 'react-icons/md'; // Material Design Icons

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
      {value === index && <div className="container mx-auto px-4">{children}</div>}
    </div>
  );
}

const SideMenu = ({ participants, room, localParticipant, listOfMessages }) => {
  console.log(participants,localParticipant)
  const [value, setValue] = useState(0);

  return (
    <div>
      <div className="bg-gray-800 p-2">
        <div className="flex flex-row">
          <button
            className={`flex-1 text-white py-2 px-4 focus:outline-none ${value === 0 ? 'bg-gray-700' : 'bg-gray-800'}`}
            onClick={() => setValue(0)}
            id="tab-0"
          >
            Chat
          </button>
          <button
            className={`flex-1 text-white py-2 px-4 focus:outline-none ${value === 1 ? 'bg-gray-700' : 'bg-gray-800'}`}
            onClick={() => setValue(1)}
            id="tab-1"
          >
            List of Participants
          </button>
          <button
            className={`flex-1 text-white py-2 px-4 focus:outline-none ${value === 2 ? 'bg-gray-700' : 'bg-gray-800'}`}
            onClick={() => setValue(2)}
            id="tab-2"
          >
            Meeting Info
          </button>
        </div>
      </div>
      <TabPanel value={value} index={0}>
        <Chat room={room} listOfMessages={listOfMessages} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="divide-y divide-gray-200">
          {participants && (
            <div className="flex items-center p-2">
                <MdGroup className="h-5 w-5 text-gray-500 mr-2" />
              Participants ({participants.length + 1})
            </div>
          )}
          {localParticipant && (
            <div className="flex items-center p-2">
               <MdPerson className="h-5 w-5 text-gray-500 mr-2" />
              {localParticipant.name}
            </div>
          )}
          {participants &&
            participants.map((e) => (
              <div key={e.id} className="flex items-center p-2">
 <MdPerson className="h-5 w-5 text-gray-500 mr-2" />
                {e.name}
              </div>
            ))}
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <MeetingInfo roomId={room.roomId} />
      </TabPanel>
    </div>
  );
};

export default SideMenu;
