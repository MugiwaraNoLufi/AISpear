import React from "react";
import * as VideoExpress from "@vonage/video-express";
import { MdBlurOn, MdBlurCircular, MdBlock } from "react-icons/md"; // Using React Icons for Material icons

const backgroundImages = ["vonage_background", "simpson_background"];
function VideoFilter({ handleChangeVideoFilter }) {
    // const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
  // console.log(process.env.NEXT_PUBLIC_URL)
    const applyFilter = async (filterName, filterPayload) => {
      setLoading(true);
      switch (filterName) {
        case "backgroundImage":
          const imageEl = await loadImage(filterPayload);
          await handleChangeVideoFilter("backgroundImage", imageEl);
          break;
        default:
          await handleChangeVideoFilter(filterName, filterPayload);
      }
      setLoading(false);
    };
  
    const loadImage = (name) => {
      return fetch(`http://localhost:3000/backgrounds/${name}.jpeg`)
        .then((res) => res.blob())
        .then((blob) => blobToBase64(blob))
        .then((base64) => {
          return base64;
        });
    };
  
    const blobToBase64 = (blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    };
  
    if (VideoExpress.hasMediaProcessorSupport()) {
      return (
        <div className="p-4">
        <p className="text-lg font-bold mb-2">Background Options</p>
        <div className="flex space-x-4 items-center">
          {loading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          <div className="relative w-12 h-12 bg-gray-200 rounded-full cursor-pointer" onClick={() => applyFilter("reset", "")}>
            <MdBlock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl" />
          </div>
          <div className="relative w-12 h-12 bg-gray-200 rounded-full cursor-pointer" onClick={() => applyFilter("blur", "low")}>
            <MdBlurOn className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl" />
          </div>
          <div className="relative w-12 h-12 bg-gray-200 rounded-full cursor-pointer" onClick={() => applyFilter("blur", "high")}>
            <MdBlurCircular className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl" />
          </div>
          {backgroundImages.map((img) => (
            <img
              key={img}
              onClick={() => applyFilter("backgroundImage", img)}
              className="w-12 h-12 object-cover rounded-full cursor-pointer"
              src={`${process.env.NEXT_PUBLIC_URL}/backgrounds/${img}.jpeg`}
              alt={`Background ${img}`}
            />
          ))}
        </div>
      </div>
      
      );
    }
    return null;
  }
  
  export default VideoFilter;