import { useParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { getCredentials } from "../../api/fetchCreds";
import useRoom from "../../hooks/useRoom";
import { UserContext } from "../../../app/(root)/context/UserContext"
import ToolBar from "../ToolBar";
import NetworkToast from "../NetworkToast";
import useScreenSharing from "../../hooks/useScreenSharing";
import usePreviewPublisher from "../../hooks/usePreviewPublisher";
import { PreferencesContext } from '../../../app/(root)/context/PreferencesContext';
import { useSymbalai } from "@/components/hooks/useSymbalai";

export default function VideoRoom() {
  const { createPreview, destroyPreview, previewPublisher, logLevel, previewMediaCreated, deviceInfo, accessAllowed } = usePreviewPublisher();

  const { user } = useContext(UserContext);
  const [credentials, setCredentials] = useState(null);
  const [error, setError] = useState(null);
  const { createCall, room, participants, connected, networkStatus, cameraPublishing, localParticipant } = useRoom();
  const { isScreenSharing, startScreenSharing, stopScreenSharing } = useScreenSharing({ room });
 
  const roomContainer = useRef();
  let { roomName } = useParams();
  console.log("pub",previewPublisher,cameraPublishing)
//   const {
//     captions,
//     messages,
//     insights,
//     name,
//     myCaptions,
//     stream,
//     stopTranscription,
//   } = useSymbalai({
//     previewPublisher,
//  cameraPublishing,
//  room
//   });

  useEffect(() => {
    getCredentials(roomName)
      .then(({ data }) => {
        setCredentials({
          apikey: data.apiKey,
          sessionId: data.sessionId,
          token: data.token,
        });
      })
      .catch((err) => {
        setError(err);
        console.log(err);
      });
  }, [roomName]);

  useEffect(() => {
    if (credentials) {
      console.log("cred",user)
      createCall(credentials, roomContainer.current, user.userName, user.videoFilter, {
        ...user.defaultSettings,
      });
    }
  }, [createCall, credentials, user]);

  if (error) return <div className="text-red-500 p-4">There was an error fetching the data from the server</div>;

  return (
<div id="callContainer" className="container mx-auto p-4 h-screen relative [backgroundColor]">
      <div id="roomContainer" className="relative" ref={roomContainer} style={{ height: 'calc(100vh - 90px)' }}>
        <NetworkToast networkStatus={networkStatus} />
        <div id="screenSharingContainer" className="absolute top-2.5 left-2.5 z-10">
          {isScreenSharing && <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center text-xl text-white">You Are Screensharing</div>}
        </div>
      </div>
      {/* <div className="border-8 bg-red-500">
        <h1>bdfhbd</h1>
          {myCaptions && (
            <span
              style={{ fontWeight: 'bold', fontSize: '21px', color: 'black' }}
            >
              You
            </span>
          )}
          {myCaptions && `: ${myCaptions}`}
        </div> */}
      <ToolBar
        room={room}
        participants={participants}
        localParticipant={localParticipant}
        connected={connected}
        cameraPublishing={cameraPublishing}
        isScreenSharing={isScreenSharing}
        startScreenSharing={startScreenSharing}
        stopScreenSharing={stopScreenSharing}
      />
    </div>
  );
}
