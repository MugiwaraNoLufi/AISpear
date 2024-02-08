"use client";

import { currentUser, useAuth } from "@clerk/nextjs";
import ReceivedMessage from "./components/ReceivedMessage";
import SideBar from "./components/SideBar";
import YourMessage from "./components/YourMessage";
import { getUserById } from "@/lib/actions/user.action";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useRouter } from "next/navigation";
function page() {
  const [user, setUser] = useState(null); // Set initial state to null
  const [dataBaseMessages, setDataBaseMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [file, setFile] = useState(null); // Set initial state to null
  const [selectedLang, setSelectedLang] = useState("en");
  const [receiver, setReceiver] = useState(null);
  const { userId } = useAuth();
  console.log(userId);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const socketRef = useRef();
  const router = useRouter();

  const handleUserClick = (clickedUserId) => {
    setReceiver(clickedUserId);
  };

  const clearReceiverSocketId = () => {
    setReceiver(null);
  };

  const sendMessage = async () => {
    if (currentMessage.trim() === "" || !receiver || !user || !userId) return;

    if (file) {
      // ... (unchanged code for file handling)
    } else {
      console.log("sending message", socketRef.current.id);
      const messageData = {
        receiver: receiver.socketId || "",
        author: socketRef.current.id || "",
        message: currentMessage,
        type: "text",
      };

      let translatedMessageData = { ...messageData };

      if (selectedLang !== "en") {
        const translatedText = await translateText(
          currentMessage,
          selectedLang,
          "en"
        );
        translatedMessageData.message = translatedText?.translatedText;
      }

      socketRef.current.emit("send_message", translatedMessageData, (cb) => {
        const updatedMessageList = [
          ...messageList,
          {
            ...messageData,
            author: { username: user.username, _id: user._id },
            receiver: { _id: receiver.userId, username: receiver.username },
            playerId: cb.playerId,
          },
        ];
        setMessageList(updatedMessageList);
      });

      setCurrentMessage("");
    }
  };

  const handleReceiveMessage = async (data) => {
    if (data.type === "text" && selectedLang !== "en") {
      const translatedText = await translateText(
        data.message,
        "en",
        selectedLang
      );
      data.message = translatedText?.translatedText;
    }
    setMessageList((prevData) => [...prevData, data]);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUserById(userId);
      console.log(fetchedUser);
      setUser(fetchedUser);
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("new-user-add", user?._id, user?.username);
    socketRef.current.on("get-users", (users) => {
      console.log(users);
      setOnlineUsers(users);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);

  useEffect(() => {
    socketRef.current.on("receive_message", handleReceiveMessage);

    return () => {
      socketRef.current.off("receive_message", handleReceiveMessage);
    };
  }, [selectedLang]);

  return (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        {/* SideBar */}
        <SideBar
          onlineUsers={onlineUsers}
          author={user?._id}
          handleUserClick={handleUserClick}
        />
        {/* SideBar End */}
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 h-full p-4 bg-gray-100 rounded-2xl">
            <div className="flex flex-col h-full mb-4 overflow-x-auto">
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-y-2">
                  <div className="col-start-1 col-end-8 p-3 rounded-lg">
                    <div className="flex flex-row items-center">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-indigo-500 rounded-full">
                        A
                      </div>
                      <div className="relative px-4 py-2 ml-3 text-sm bg-white shadow rounded-xl">
                        <div>Hey How are you today?</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-start-1 col-end-8 p-3 rounded-lg">
                    <div className="flex flex-row items-center">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-indigo-500 rounded-full">
                        A
                      </div>
                      <div className="relative px-4 py-2 ml-3 text-sm bg-white shadow rounded-xl">
                        <div>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Vel ipsa commodi illum saepe numquam maxime
                          asperiores voluptate sit, minima perspiciatis.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-start-6 col-end-13 p-3 rounded-lg">
                    <div className="flex flex-row-reverse items-center justify-start">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-indigo-500 rounded-full">
                        A
                      </div>
                      <div className="relative px-4 py-2 mr-3 text-sm bg-indigo-100 shadow rounded-xl">
                        <div>I'm ok what about you?</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-start-6 col-end-13 p-3 rounded-lg">
                    <div className="flex flex-row-reverse items-center justify-start">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-indigo-500 rounded-full">
                        A
                      </div>
                      <div className="relative px-4 py-2 mr-3 text-sm bg-indigo-100 shadow rounded-xl">
                        <div>
                          Lorem ipsum dolor sit, amet consectetur adipisicing. ?
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-start-1 col-end-8 p-3 rounded-lg">
                    <div className="flex flex-row items-center">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-indigo-500 rounded-full">
                        A
                      </div>
                      <div className="relative px-4 py-2 ml-3 text-sm bg-white shadow rounded-xl">
                        <div>Lorem ipsum dolor sit amet !</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center w-full h-16 px-4 bg-white rounded-xl">
              <div>
                <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="flex-grow ml-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    className="flex w-full h-10 pl-4 border rounded-xl focus:outline-none focus:border-indigo-300"
                    value={currentMessage}
                    placeholder="Hey..."
                    onChange={(event) => setCurrentMessage(event.target.value)}
                    onKeyPress={(event) =>
                      event.key === "Enter" && sendMessage()
                    }
                  />
                  <button className="absolute top-0 right-0 flex items-center justify-center w-12 h-full text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="ml-4">
                <button
                  className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-3 flex-shrink-0 cursor-pointer"
                  onClick={sendMessage}
                >
                  <svg
                    className="w-4 h-4 -mt-px transform rotate-45"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
