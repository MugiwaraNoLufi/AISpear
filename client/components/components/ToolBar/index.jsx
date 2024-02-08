import { useState, useEffect } from "react";

import { useParams, useRouter } from "next/navigation";
import * as VideoExpress from "@vonage/video-express";
import MuteAudioButton from "../MuteAudioButton";
import MuteVideoButton from "../MuteVideoButton";
import SpeakerSelector from "../SpeakerSelector";
import RecordingButton from "../RecordingButton";
import LayoutButton from "../LayoutButton";
import MuteAll from "../MuteAllButton";
import ReactionsButton from "../ReactionsButton";
import ScreenSharingButton from "../ScreenSharingButton";
import EndCallButton from "../EndCallButton";
import VideoFilterButton from "../VideoFilterButton";
import MoreOptionsButton from "../MoreOptionsButton";
export default function ToolBar({
  room,
  connected,
  cameraPublishing,
  isScreenSharing,
  startScreenSharing,
  stopScreenSharing,
  participants,
  localParticipant,
}) {
  const { roomName } = useParams();
  const router = useRouter();
  const [hasAudio, setHasAudio] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);
  const [areAllMuted, setAllMuted] = useState(false);
  const isMobileWidth = window.innerWidth < 640;
  const handleMuteAll = () => {
    if (!areAllMuted) {
      participants.map((participant) => participant.camera.disableAudio());

      setAllMuted(true);
    } else {
      participants.map((participant) => participant.camera.enableAudio());
      setAllMuted(false);
    }
  };
  const toggleVideo = () => {
    if (room && room.camera) {
      const { camera } = room;
      const isVideoEnabled = camera.isVideoEnabled();
      if (isVideoEnabled) {
        camera.disableVideo();
        setHasVideo(false);
      } else {
        camera.enableVideo();
        setHasVideo(true);
      }
    }
  };
  const toggleAudio = () => {
    if (room && room.camera) {
      const camera = room.camera;
      const isAudioEnabled = camera.isAudioEnabled();
      if (isAudioEnabled) {
        camera.disableAudio();
        setHasAudio(false);
      } else {
        camera.enableAudio();
        setHasAudio(true);
      }
    }
  };

  const getVideoSource = () => {
    if (room && room.camera) {
      return room.camera.getVideoDevice();
    }
  };

  const changeVideoSource = (videoId) => {
    room.camera.setVideoDevice(videoId);
  };
  const changeAudioSource = (audioId) => {
    room.camera.setAudioDevice(audioId);
  };

  const changeAudioOutput = async (audioOutputDeviceId) => {
    await VideoExpress.setAudioOutputDevice(audioOutputDeviceId);
  };

  const getCurrentAudioOutput = async () => {
    try {
      const currentAudioOutput =
        await VideoExpress.getActiveAudioOutputDevice();
      return currentAudioOutput.deviceId;
    } catch (e) {
      return e;
    }
  };

  const getAudioSource = async () => {
    if (room && room.camera) {
      const audioDevice = await room.camera.getAudioDevice();
      return audioDevice.deviceId;
    }
  };

  const endCall = () => {
    if (room) {
      router.push(`${roomName}/${room.roomId}/end`);
      room.leave();
    }
  };
  useEffect(() => {
    if (connected) {
      const isAudioEnabled =
        room && room.camera && room.camera.isAudioEnabled() ? true : false;
      const isVideoEnabled =
        room && room.camera && room.camera.isVideoEnabled() ? true : false;
      setHasAudio(isAudioEnabled);
      setHasVideo(isVideoEnabled);
    }
    // if (room) console.log(getParticipantsList());
  }, [connected, room]);
  return (
    <div
      className={
        isMobileWidth
          ? "p-2 bg-gray-800 flex justify-between items-center border-0 rounded-xl "
          : "p-4 bg-gray-900 flex justify-around items-center border-0 rounded-xl "
      }
    >
      {isMobileWidth ? (
        <>
          <MuteAudioButton
            toggleAudio={toggleAudio}
            hasAudio={hasAudio}
            changeAudioSource={changeAudioSource}
          />
          <EndCallButton handleEndCall={endCall} />
          <MuteVideoButton
            toggleVideo={toggleVideo}
            hasVideo={hasVideo}
            changeAudioSource={changeAudioSource}
          />
          {/* Add other buttons as necessary for mobile view */}
        </>
      ) : (
        <>
          <div className="flex items-center justify-around px-3 py-1 bg-gray-800 border-0 rounded-lg md:w-60">
            <MuteAudioButton
              toggleAudio={toggleAudio}
              hasAudio={hasAudio}
              changeAudioSource={changeAudioSource}
              getAudioSource={getAudioSource}
              cameraPublishing={cameraPublishing}
            />

            <MuteVideoButton
              toggleVideo={toggleVideo}
              hasVideo={hasVideo}
              getVideoSource={getVideoSource}
              cameraPublishing={cameraPublishing}
              changeVideoSource={changeVideoSource}
            />
            <EndCallButton handleEndCall={endCall} />
          </div>
          <MoreOptionsButton
            participants={participants}
            room={room}
            localParticipant={localParticipant}
          />
          {VideoExpress.hasMediaProcessorSupport() && (
            <VideoFilterButton room={room} />
          )}
          {/* Add other buttons as necessary for desktop view */}
          <SpeakerSelector
            room={room}
            changeAudioOutput={changeAudioOutput}
            getCurrentAudioOutput={getCurrentAudioOutput}
          />

          <RecordingButton room={room} />
          <ScreenSharingButton
            isScreenSharing={isScreenSharing}
            startScreenSharing={startScreenSharing}
            stopScreenSharing={stopScreenSharing}
          />
          <MuteAll handleMuteAll={handleMuteAll} areAllMuted={areAllMuted} />
          <ReactionsButton
            handleMuteAll={handleMuteAll}
            areAllMuted={areAllMuted}
            room={room}
          />
          <LayoutButton room={room} />
        </>
      )}
    </div>
  );
}
