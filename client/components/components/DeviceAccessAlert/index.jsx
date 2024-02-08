import { DEVICE_ACCESS_STATUS } from '../constants';

const askDeviceMessage =
  'To join the video room, your browser will request access to your cam and mic.';
const deniedDeviceMessage =
  'It seems your browser is blocked from accessing your camera and/or microphone';

export default function DeviceAccessAlert({ accessStatus }) {
  const messageToDisplay =
    accessStatus === DEVICE_ACCESS_STATUS.PENDING
      ? askDeviceMessage
      : deniedDeviceMessage;
  const imgToDisplay =
    accessStatus === DEVICE_ACCESS_STATUS.PENDING
      ? '/images/access-dialog-pending.png'
      : '/images/access-dialog-rejected.png';

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center">
    <div className="text-center text-white">
      <h2 className="text-xl font-semibold mb-4">{messageToDisplay}</h2>
      <img
        src={imgToDisplay}
        alt="Access Dialog"
        className="mx-auto max-w-xs sm:max-w-lg"
      />
    </div>
  </div>
  );
}
