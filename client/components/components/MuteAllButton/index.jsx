import { MdRecordVoiceOver, MdVoiceOverOff } from 'react-icons/md';

export default function MuteAllButton({ handleMuteAll, areAllMuted }) {
  const title = areAllMuted ? 'Unmute Participants' : 'Mute Participants';

  return (
    <button
      onClick={handleMuteAll}
      className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
