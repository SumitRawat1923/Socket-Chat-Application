import React, { useEffect, useState, useRef } from "react";
import { CiSettings } from "react-icons/ci";
import { IoSend } from "react-icons/io5";
import { useSocketContext } from "../context/socket-context";
import { createPortal } from "react-dom";
import PopUp from "./pop-up";
import { SiSocketdotio } from "react-icons/si";
import { useStateContext } from "../context/status-context";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const socket = useSocketContext();
  const { status } = useStateContext();
  const chatDivRef = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.on("userInfoChanged", (userList) => {
        let newUsersMap = {};
        userList.forEach((e) => {
          newUsersMap[e.id] = e.user;
        });
        setUsersMap(newUsersMap);
      });

      socket.on("message", (msg, id, user) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id, user, message: msg },
        ]);
      });
    }
    return () => {
      if (socket) {
        socket.off("message");
        socket.off("userInfoChanged");
      }
    };
  }, [socket]);

  // Scroll to the end of the chat when messages change
  useEffect(() => {
    if (chatDivRef.current) {
      chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const message = e.target[0].value;
    if (message) socket.emit("message", message);
    e.target[0].value = "";
  };

  const onClickHandler = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full xl:w-3/4 h-full flex flex-col bg-gray-600">
      {isOpen && createPortal(<PopUp setIsOpen={setIsOpen} />, document.body)}
      <div className="py-3 bg-black text-white justify-between  flex items-center px-6 text-3xl ">
        <span className="relative">
          SOCKET.IO
          <SiSocketdotio
            className={`absolute top-0 right-0 translate-x-full w-5 h-5 `}
            fill={status === "online" ? "limegreen" : "red"}
          />
        </span>
        <div
          onClick={onClickHandler}
          className="aspect-square w-8 bg-white hover:opacity-90 rounded-full flex items-center   justify-center"
        >
          <CiSettings
            className="w-6 h-6 hover:rotate-90 duration-500 transition-all "
            fill="black"
          />
        </div>
      </div>
 
      <div
        ref={chatDivRef}
        className="flex-grow flex flex-col gap-3 p-6 overflow-y-auto chat-div"
      >
        {messages.map((e) => {
          return (
            <div
              key={e.id}
              className={`w-3/4  flex flex-col   ${
                e.id === socket?.id ? "self-end" : "self-start"
              }  `}
            >
              <div
                className={`bg-white text-sm sm:text-base px-3 py-2  md:p-3 md:px-6 rounded-3xl    ${
                  e.id === socket?.id
                    ? "self-end rounded-tr-none "
                    : "self-start rounded-tl-none"
                } self-start`}
              >
                {e.id !== socket?.id && (
                  <p className="text-orange-600 text-[14px] font-normal">
                    {usersMap.hasOwnProperty(e.id) ? usersMap[e.id] : e.id}
                  </p>
                )}
                {e.message}
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={onSubmitHandler} className="flex">
        <input
          type="text"
          className="outline-none py-2  px-6 w-full"
          placeholder={
            status === "offline"
              ? "When the status is offline, messages cannot be sent."
              : "Type a message."
          }
        />
        <button
          type="submit"
          disabled={status === "offline"}
          className={`h-12 px-6 ${
            status === "online" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          <IoSend />
        </button>
      </form>
    </div>
  );
}

export default Chat;
