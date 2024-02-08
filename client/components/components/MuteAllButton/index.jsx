import { MdRecordVoiceOver, MdVoiceOverOff } from 'react-icons/md';

export default function MuteAllButton({ handleMuteAll, areAllMuted }) {
  const title = areAllMuted ? 'Unmute Participants' : 'Mute Participants';

  return (
    <button
      onClick={handleMuteAll}
      className="p-3 text-black hover:text-gray-700 bg-gray-200 rounded-full hover:bg-white transition duration-200"
      title={title}
      aria-label={title}
    >
      {areAllMuted ? (
        <MdRecordVoiceOver className="text-lg" />
      ) : (
        <MdVoiceOverOff className="text-lg" />
      )}
    </button>
  );
}
