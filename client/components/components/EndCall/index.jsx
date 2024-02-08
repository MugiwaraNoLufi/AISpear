import React, { useEffect, useState } from 'react';
import { fetchRecordings } from '../../api/fetchRecording';

import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { MdGetApp } from 'react-icons/md';

export default function EndCall() {
  const router = useRouter();
  const [recordings, setRecordings] = useState(null);
  const { sessionId } = useParams();

  const redirectNewMeeting = () => {
  router.push('/');
  };

  useEffect(() => {
    fetchRecordings(sessionId)
      .then(data => {
        if (data.data) {
          setRecordings(data.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">This is an amazing meeting</h2>
        <h2 className="text-xl">I hope you have had fun with us</h2>
        <button
          onClick={redirectNewMeeting}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Start new meeting
        </button>
      </div>
      <div className="w-1/2">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-lg font-semibold">
            {recordings && recordings.length ? 'Recordings' : 'There are no recordings'}
          </h3>
          {recordings && (
            <ul className="list-disc">
              {recordings.map(recording => (
                <li key={recording.id} className="mt-2">
                  Started at: {new Date(recording.createdAt).toLocaleString()}
                  {recording.status === 'available' && (
                    <a
                      href={recording.url}
                      target="_blank"
                      className="ml-2 inline-block align-middle"
                      rel="noreferrer"
                    >
                      <MdGetApp className="text-lg" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
