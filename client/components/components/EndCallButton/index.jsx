import { IoExitOutline } from 'react-icons/io5';

export default function EndCallIcon({ handleEndCall }) {
  return (
    <button
      onClick={handleEndCall}
      className="p-2 bg-red-600 text-white rounded-full inline-flex items-center justify-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      aria-label="End call"
    >
      <IoExitOutline className="text-lg" />
    </button>
  );
}
