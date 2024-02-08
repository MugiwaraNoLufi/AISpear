import React, { useEffect, useState } from "react";
import { fetchRecordings } from "../../api/fetchRecording";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { MdGetApp } from "react-icons/md";
import HighitlightText from "@/components/shared/HighitlightText";

export default function EndCall() {
  const router = useRouter();
  const [recordings, setRecordings] = useState(null);
  const { sessionId } = useParams();

  const redirectNewMeeting = () => {
    router.push("/");
  };

  useEffect(() => {
    fetchRecordings(sessionId)
      .then((data) => {
        if (data.data) {
          setRecordings(data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [sessionId]);

  return (
    <div className="flex-col flex-center ">
      <div className="mb-4 text-center">
        <h1 className="mb-4 text-3xl">
          <HighitlightText text="Thank you for joining the meeting" />
        </h1>
        <h2 className="text-xl">I hope you have had fun with us</h2>
        {/* Starting new button */}
        <button
          onClick={redirectNewMeeting}
          className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Start new meeting
        </button>
      </div>

      {/* Other components for recordings */}
      <div className="w-1/2">
        <div className="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md flex-center">
          <h3 className="text-lg font-semibold text-center">
            {recordings && recordings.length
              ? "Recordings"
              : "There are no recordings"}
          </h3>
          {recordings && (
            <ul className="list-disc">
              {recordings.map((recording) => (
                <li key={recording.id} className="mt-2">
                  Started at: {new Date(recording.createdAt).toLocaleString()}
                  {recording.status === "available" && (
                    <a
                      href={recording.url}
                      target="_blank"
                      className="inline-block ml-2 align-middle"
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
