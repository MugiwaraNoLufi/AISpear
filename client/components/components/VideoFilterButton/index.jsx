import { useCallback, useState } from "react";
import { startRecording, stopRecording } from "../../api/fetchRecording";
import { MdCameraEnhance } from "react-icons/md"; // Using React Icons
import VideoFilter from "../VideoFilter";

export default function VideoFilterButton({ room }) {
  const [open, setOpen] = useState(false);
  const [videoFilter, setVideoFilter] = useState({ filterName: "", filterPayload: "" });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeVideoFilter = useCallback(
    async (filter, filterPayload) => {
      const camera = room.camera;
      if (camera && filter) {
        switch (filter) {
          case "reset":
            await camera.clearVideoFilter();
            setVideoFilter({ filterName: "", filterPayload: "" });
            break;
          case "blur":
            await camera.setVideoFilter({ type: "backgroundBlur", blurStrength: filterPayload });
            setVideoFilter({ filterName: filter, filterPayload });
            break;
          case "backgroundImage":
            await camera.setVideoFilter({ type: "backgroundReplacement", backgroundImgUrl: filterPayload });
            setVideoFilter({ filterName: filter, filterPayload });
            break;
          default:
          // do nothing
        }
      }
    },
    [room]
  );

  return (
    <>
      <button onClick={handleOpen} className="p-2 text-gray-500 hover:text-gray-700">
        <MdCameraEnhance size={24} />
      </button>
      {open && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <button onClick={handleClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
              Close
            </button>
            <VideoFilter handleChangeVideoFilter={handleChangeVideoFilter} />
          </div>
        </div>
      )}
    </>
  );
}
