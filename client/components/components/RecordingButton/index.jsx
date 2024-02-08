import React, { useState } from 'react';
import { MdFiberManualRecord } from 'react-icons/md'; // Material Design icon
import { startRecording, stopRecording } from '../../api/fetchRecording';

export default function RecordingButton({ room }) {
  const [isRecording, setRecording] = useState(false);
  const [archiveId, setArchiveId] = useState(null);

  const handleRecordingStart = async sessionId => {
    try {
      const data = await startRecording(sessionId);
      if (data.status === 200 && data.data) {
        const { archiveId } = data.data;
        setArchiveId(archiveId);
        setRecording(true);
      }
    } catch (e) {
      setRecording(false);
    }
  };

  const handleRecordingStop = async archiveId => {
    try {
      if (isRecording) {
        const data = await stopRecording(archiveId);
        if (data.status === 200 && data.data) {
          setRecording(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleRecordingAction = () => {
    if (room) {
      const sessionId = room.roomId;
      isRecording
        ? handleRecordingStop(archiveId)
        : handleRecordingStart(sessionId);
    }
  };

  const title = isRecording ? 'Stop Recording' : 'Start Recording';

  return (
    <div className="tooltip" data-tip={title}>
      <button
        type="button"
        onClick={handleRecordingAction}
        className={`p-2 rounded-full focus:outline-none focus:ring focus:border-blue-300 ${
          isRecording ? 'bg-red-500 text-white' : 'bg-gray-200'
        }`}
      >
        <MdFiberManualRecord className={`h-6 w-6 ${isRecording ? 'text-red-600' : 'text-current'}`} />
      </button>
    </div>
  );
}
