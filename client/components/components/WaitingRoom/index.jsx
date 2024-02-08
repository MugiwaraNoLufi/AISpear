import React, { useContext, useEffect, useRef, useState } from "react";

import { PreferencesContext } from "../../../app/(root)/context/PreferencesContext";
// import { useNavigate } from "react-router-dom";
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
import GradientBg from "@/components/shared/GradientBg";

export default function WaitingRoom({ location }) {
  //   const classNamees = useStyles();
  const { preferences, setPreferences } = useContext(PreferencesContext);
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
    if (userName !== preferences.userName) {
      setPreferences({ userName: userName });
    }
  }, [userName, setPreferences, preferences.userName]);

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
      <div classNameName="flex-col px-6 py-24 bg-white dark:bg-gray-900 flex-center isolate sm:py-32 lg:px-8">
        <GradientBg />
        {/* Heading Text */}
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            <HighitlightText text="Welcome to Video Express" />
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-white">
            Join The Video Call Fill Rereqiured Details
          </p>
        </div>

        <div classNameName="flex flex-col items-center justify-center sm:flex-row lg:flew-row lg:gap-10">
          <form classNameName="max-w-xl mx-auto mt-16 sm:mt-20">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <label
                  for="first-name"
                  classNameName="block text-sm font-semibold leading-6 text-black dark:text-white"
                >
                  Room Name
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    placeholder="Room Name"
                    value={roomName}
                    onChange={onChangeRoomName}
                    onKeyDown={onKeyDown}
                    name="first-name"
                    id="first-name"
                    autocomplete="given-name"
                    classNameName="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm shadow-blue-500 ring-1 ring-inset ring-blue-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {isRoomNameInvalid && (
                <p classNameName="text-xs italic text-red-500">
                  Please enter a room name.
                </p>
              )}

              <div>
                <label
                  for="name"
                  classNameName="block text-sm font-semibold leading-6 text-black dark:text-white"
                >
                  Name
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    placeholder="Name"
                    value={userName}
                    onChange={onChangeParticipantName}
                    onKeyDown={onKeyDown}
                    name="name"
                    id="name"
                    autocomplete="given-name"
                    classNameName="block w-full rounded-md border-0 px-3.5 py-2  text-gray-900 shadow-sm shadow-blue-500 ring-1 ring-inset ring-blue-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {isUserNameInvalid && (
                <p classNameName="text-xs italic text-red-500">
                  Please enter a name.
                </p>
              )}
              <div classNameName="flex flex-col mb-4">
                {deviceInfo && previewMediaCreated && (
                  <>
                    <div classNameName="mb-2">
                      <label
                        htmlFor="audioDevice"
                        classNameName="block text-sm font-semibold leading-6 text-black"
                      >
                        Select Audio Input Device
                      </label>
                      <select
                        id="audioDevice"
                        value={audioDevice}
                        onChange={handleAudioSource}
                        classNameName="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm shadow-blue-500 ring-1 ring-inset ring-blue-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"
                      >
                        {deviceInfo.audioInputDevices.map((device) => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {deviceInfo.audioOutputDevices && (
                      <div classNameName="mb-2">
                        <label
                          htmlFor="audioOutputDevice"
                          classNameName="block text-sm font-semibold leading-6 text-black dark:text-white"
                        >
                          Select Audio Output Device
                        </label>
                        <select
                          id="audioOutputDevice"
                          value={audioOutputDevice}
                          onChange={handleAudioOutput}
                          classNameName="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm shadow-blue-500 ring-1 ring-inset ring-blue-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"
                        >
                          {deviceInfo.audioOutputDevices.map((device) => (
                            <option
                              key={device.deviceId}
                              value={device.deviceId}
                            >
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
                      classNameName="block text-sm font-semibold leading-6 text-black dark:text-white"
                    >
                      Select Video Input Device
                    </label>
                    <select
                      id="videoDevice"
                      value={videoDevice}
                      onChange={handleVideoSource}
                      classNameName="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm shadow-blue-500 ring-1 ring-inset ring-blue-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"
                    >
                      {deviceInfo.videoInputDevices && (
                        <>
                          {deviceInfo.videoInputDevices.map((device) => (
                            <option
                              key={device.deviceId}
                              value={device.deviceId}
                            >
                              {device.label}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </form>
          {/* Video Preview Container */}
          <hr className="border-gray-800 dark:border-white" />
          <div classNameName="p-4 border-black bottom-4 flex-center ">
            <div
              id="waiting-room-video-container"
              classNameName="flex items-center justify-center my-4 mt-10 min-h-40"
              ref={waitingRoomVideoContainer}
            ></div>
          </div>
          {/* Video Settings */}
          <div classNameName="flex-col mb-4 space-x-3 flex-center">
            <AudioSettings
              classNameName="flex justify-between"
              hasAudio={localAudio}
              onAudioChange={handleAudioChange}
            />
            <LinearProgress
              variant="determinate"
              value={logLevel}
              classNameName="w-full"
            />
            <VideoSettings
              classNameName="flex items-center justify-between mt-4"
              hasVideo={localVideo}
              onVideoChange={handleVideoChange}
            />
          </div>
          {/* Video Filter */}
          <VideoFilter handleChangeVideoFilter={handleChangeVideoFilter} />
        </div>
        {/* Video Call Joining Button */}
        <button
          classNameName="inline-flex items-center px-4 py-3 mt-5 text-sm font-semibold text-white bg-blue-600 border border-transparent rounded-lg gap-x-2 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          onClick={handleJoinClick}
          disabled={!roomName || !userName}
        >
          Join Call
        </button>
      </div>

      {accessAllowed !== DEVICE_ACCESS_STATUS.ACCEPTED && (
        <DeviceAccessAlert accessStatus={accessAllowed}></DeviceAccessAlert>
      )}
    </>
  );
}
