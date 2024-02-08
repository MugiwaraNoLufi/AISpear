import React, { useContext, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import * as VideoExpress from "@vonage/video-express";
import usePreviewPublisher from "../../hooks/usePreviewPublisher";
import AudioSettings from "../AudioSetting";
import VideoSettings from "../VideoSetting";
import DeviceAccessAlert from "../DeviceAccessAlert";
import { UserContext } from "../../../app/(root)/context/UserContext";
import VideoFilter from "../VideoFilter";
import LinearProgress from "../LinearProgress";
import { DEVICE_ACCESS_STATUS } from "./../constants";
import HighitlightText from "@/components/shared/HighitlightText";

export default function WaitingRoom({ location }) {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const waitingRoomVideoContainer = useRef();
  const roomToJoin = location?.state?.room || "";
  const [roomName, setRoomName] = useState(roomToJoin);
  const [userName, setUserName] = useState("");
  const [isRoomNameInvalid, setIsRoomNameInvalid] = useState(false);
  const [isUserNameInvalid, setIsUserNameInvalid] = useState(false);
  const [localAudio, setLocalAudio] = useState(
    user.defaultSettings.publishAudio
  );
  const [localVideo, setLocalVideo] = useState(
    user.defaultSettings.publishVideo
  );
  const [localVideoSource, setLocalVideoSource] = useState(undefined);
  const [localAudioSource, setLocalAudioSource] = useState(undefined);
  const [localAudioOutput, setLocalAudioOutput] = useState(undefined);
  /* const [devices, setDevices] = useState(null); */
  let [audioDevice, setAudioDevice] = useState("");
  let [videoDevice, setVideoDevice] = useState("");
  let [audioOutputDevice, setAudioOutputDevice] = useState("");
  // const [backgroundBlur, setBackgroundBlur] = useState(user.videoEffects.backgroundBlur);
  const [videoFilter, setVideoFilter] = useState({
    filterName: "",
    filterPayload: "",
  });
  const {
    createPreview,
    destroyPreview,
    previewPublisher,
    logLevel,
    previewMediaCreated,
    deviceInfo,
    accessAllowed,
  } = usePreviewPublisher();

  const handleVideoSource = React.useCallback(
    (e) => {
      const videoDeviceId = e.target.value;
      setVideoDevice(e.target.value);
      previewPublisher.setVideoDevice(videoDeviceId);
      setLocalVideoSource(videoDeviceId);
    },
    [previewPublisher, setVideoDevice, setLocalVideoSource]
  );

  const handleAudioSource = React.useCallback(
    (e) => {
      const audioDeviceId = e.target.value;
      setAudioDevice(audioDeviceId);
      previewPublisher.setAudioDevice(audioDeviceId);
      setLocalAudioSource(audioDeviceId);
    },
    [previewPublisher, setAudioDevice, setLocalAudioSource]
  );

  const handleAudioOutput = React.useCallback(
    (e) => {
      const audioOutputId = e.target.value;
      setAudioOutputDevice(audioOutputId);
      // await VideoExpress.setAudioOutputDevice(audioOutputId);
      setLocalAudioOutput(audioOutputId);
    },
    [setLocalAudioOutput, setAudioOutputDevice]
  );

  const redirectHttps = React.useCallback(() => {
    const url = window.location.href;
    if (
      url.toString().indexOf("http://") === 0 &&
      url.toString().indexOf("http://localhost") !== 0
    ) {
      window.location.href = window.location.href
        .toString()
        .replace("http://", "https://");
    } else {
      return;
    }
  }, []);

  const handleJoinClick = () => {
    if (validateForm()) {
      localStorage.setItem("username", userName);
      router.push(`room/${roomName}`);
    }
  };

  const validateForm = () => {
    if (userName === "") {
      setIsUserNameInvalid(true);
      return false;
    } else if (roomName === "") {
      setIsRoomNameInvalid(true);
      return false;
    }
    return true;
  };

  const onChangeRoomName = (e) => {
    const roomName = e.target.value;
    if (roomName === "" || roomName.trim() === "") {
      // Space detected
      setRoomName("");
      return;
    }
    setIsRoomNameInvalid(false);
    setRoomName(roomName);
  };

  const onChangeParticipantName = (e) => {
    const userName = e.target.value;
    if (userName === "" || userName.trim() === "") {
      // Space detected
      setUserName("");
      return;
    }
    setIsUserNameInvalid(false);
    setUserName(userName);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleJoinClick();
    }
  };

  const handleAudioChange = React.useCallback((e) => {
    setLocalAudio(e.target.checked);
  }, []);

  const handleVideoChange = React.useCallback((e) => {
    setLocalVideo(e.target.checked);
  }, []);

  const handleChangeVideoFilter = React.useCallback(
    async (filter, filterPayload) => {
      if (previewPublisher && filter) {
        switch (filter) {
          case "reset":
            await previewPublisher.clearVideoFilter();
            setVideoFilter({ filterName: "", filterPayload: "" });
            break;
          case "blur":
            await previewPublisher.setVideoFilter({
              type: "backgroundBlur",
              blurStrength: filterPayload,
            });
            setVideoFilter({ filterName: filter, filterPayload });
            break;
          case "backgroundImage":
            await previewPublisher.setVideoFilter({
              type: "backgroundReplacement",
              backgroundImgUrl: filterPayload,
            });
            setVideoFilter({ filterName: filter, filterPayload });
            break;
          default:
          // do nothing
        }
      }
    },
    [previewPublisher]
  );

  useEffect(() => {
    redirectHttps();
    if (localStorage.getItem("username")) {
      setUserName(localStorage.getItem("username"));
    }
  }, [redirectHttps]);

  useEffect(() => {
    console.log("user hai kya", user, "local video", localVideo);
    if (
      localAudio !== user.defaultSettings.publishAudio ||
      localVideo !== user.defaultSettings.publishVideo ||
      localAudioSource !== user.defaultSettings.audioSource ||
      localVideoSource !== user.defaultSettings.videoSource ||
      videoFilter.filterName !== user.videoFilter.filterName ||
      videoFilter.filterPayload !== user.videoFilter.filterPayload ||
      localAudioOutput !== user.defaultSettings.audioOutput
    ) {
      setUser({
        ...user,
        videoFilter: {
          filterName: videoFilter.filterName,
          filterPayload: videoFilter.filterPayload,
        },
        defaultSettings: {
          publishAudio: localAudio,
          publishVideo: localVideo,
          audioSource: localAudioSource,
          videoSource: localVideoSource,
          audioOutput: localAudioOutput,
        },
      });
    }
  }, [
    localAudio,
    localVideo,
    user,
    setUser,
    localAudioSource,
    localVideoSource,
    videoFilter,
    localAudioOutput,
  ]);

  useEffect(() => {
    if (userName !== user.userName) {
      setUser({ ...user, userName: userName });
    }
  }, [userName, user, setUser]);

  useEffect(() => {
    if (previewPublisher && previewMediaCreated && deviceInfo) {
      previewPublisher.getAudioDevice().then((currentAudioDevice) => {
        setAudioDevice(currentAudioDevice.deviceId);
      });
      const currentVideoDevice = previewPublisher.getVideoDevice();
      setVideoDevice(currentVideoDevice.deviceId);

      VideoExpress.getActiveAudioOutputDevice().then(
        (currentAudioOutputDevice) => {
          setAudioOutputDevice(currentAudioOutputDevice.deviceId);
        }
      );
    }
  }, [
    deviceInfo,
    previewPublisher,
    setAudioDevice,
    setVideoDevice,
    previewMediaCreated,
    setAudioOutputDevice,
  ]);

  useEffect(() => {
    if (previewPublisher) {
      if (localAudio && !previewPublisher.isAudioEnabled()) {
        previewPublisher.enableAudio();
      } else if (!localAudio && previewPublisher.isAudioEnabled()) {
        previewPublisher.disableAudio();
      }
    }
  }, [localAudio, previewPublisher]);

  useEffect(() => {
    if (previewPublisher) {
      // console.log("localVideo", localVideo)
      if (localVideo && !previewPublisher.isVideoEnabled()) {
        previewPublisher.enableVideo();
      } else if (!localVideo && previewPublisher.isVideoEnabled()) {
        previewPublisher.disableVideo();
      }
    }
  }, [localVideo, previewPublisher]);

  useEffect(() => {
    if (waitingRoomVideoContainer.current) {
      createPreview(waitingRoomVideoContainer.current);
    }

    return () => {
      // stopEffect();
      destroyPreview();
    };
  }, [createPreview, destroyPreview]);

  return (
    <>
      <div className="px-6 py-24 bg-white isolate sm:py-32 lg:px-8">
        <div
          class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true"
        >
          <div class="custom-clip-path relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"></div>
        </div>
        {/* Heading Text */}
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            <HighitlightText text="Welcome to Video Express" />
          </h2>
          <p class="mt-2 text-lg leading-8 text-gray-600">
            Join The Video Call Fill Rereqiured Details
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <form className="max-w-xl mx-auto mt-16 sm:mt-20">
            <input
              className="w-full p-2 border border-gray-400 rounded-md"
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={onChangeRoomName}
              onKeyDown={onKeyDown}
            />
            {isRoomNameInvalid && (
              <p className="text-xs italic text-red-500">
                Please enter a room name.
              </p>
            )}

            <input
              className="w-full p-2 mt-4 border border-gray-400 rounded-md"
              type="text"
              placeholder="Name"
              value={userName}
              onChange={onChangeParticipantName}
              onKeyDown={onKeyDown}
            />
            {isUserNameInvalid && (
              <p className="text-xs italic text-red-500">
                Please enter a name.
              </p>
            )}
            <div className="flex flex-col mb-4">
              {deviceInfo && previewMediaCreated && (
                <>
                  <div className="mb-2">
                    <label
                      htmlFor="audioDevice"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Select Audio Input Device
                    </label>
                    <select
                      id="audioDevice"
                      value={audioDevice}
                      onChange={handleAudioSource}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {deviceInfo.audioInputDevices.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {deviceInfo.audioOutputDevices && (
                    <div className="mb-2">
                      <label
                        htmlFor="audioOutputDevice"
                        className="block mb-1 text-sm font-medium text-gray-700"
                      >
                        Select Audio Output Device
                      </label>
                      <select
                        id="audioOutputDevice"
                        value={audioOutputDevice}
                        onChange={handleAudioOutput}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        {deviceInfo.audioOutputDevices.map((device) => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {deviceInfo && previewMediaCreated && (
                <div>
                  <label
                    htmlFor="videoDevice"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Select Video Input Device
                  </label>
                  <select
                    id="videoDevice"
                    value={videoDevice}
                    onChange={handleVideoSource}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {deviceInfo.videoInputDevices && (
                      <>
                        {deviceInfo.videoInputDevices.map((device) => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              )}
            </div>
          </form>
          <div
            id="waiting-room-video-container"
            className="flex items-center justify-center my-4 min-h-40"
            ref={waitingRoomVideoContainer}
          ></div>
          <div className="flex flex-col mb-4">
            <AudioSettings
              className="flex justify-between"
              hasAudio={localAudio}
              onAudioChange={handleAudioChange}
            />
            <LinearProgress
              variant="determinate"
              value={logLevel}
              className="w-full"
            />
            <VideoSettings
              className="flex justify-between"
              hasVideo={localVideo}
              onVideoChange={handleVideoChange}
            />
          </div>
          <VideoFilter handleChangeVideoFilter={handleChangeVideoFilter} />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <button
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            onClick={handleJoinClick}
            disabled={!roomName || !userName}
          >
            Join Call
          </button>
        </div>
      </div>

      {accessAllowed !== DEVICE_ACCESS_STATUS.ACCEPTED && (
        <DeviceAccessAlert accessStatus={accessAllowed}></DeviceAccessAlert>
      )}
    </>
  );
}
