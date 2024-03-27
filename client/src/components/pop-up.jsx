import React, { useEffect, useState } from "react";
import { useSocketContext } from "../context/socket-context";
import { MdMotionPhotosOff, MdMotionPhotosOn } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { useStateContext } from "../context/status-context";
import ConnectedUsersList from "./connected-users-list";

function PopUp({ setIsOpen }) {
  const [currentForm, setCurrentForm] = useState("name");

  return (
    <div
      onClick={() => {
        setIsOpen(false);
      }}
      className="w-full px-2 h-full absolute bg-black/50 z-10 top-0 left-0 flex items-center justify-center  "
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="p-2 py-3 md:p-6 bg-white flex flex-col  rounded-md max-w-xl w-full max-h-64 md:max-h-72 h-full relative"
      >
        <div
          onClick={(e) => {
            setIsOpen(false);
          }}
          className="absolute top-0 right-0 bg-red-500  flex items-start justify-center "
        >
          <IoCloseSharp className="w-5 h-5 " fill="white" />
        </div>
        <div className="w-full  mb-3 flex  ">
          <span
            onClick={() => {
              setCurrentForm("name");
            }}
            className={`text-center w-full font-semibold py-2 md:py-4 border-black text-sm md:text-base  hover:bg-black/5 ${
              currentForm === "name" ? "border-b-2" : ""
            } `}
          >
            SET NAME
          </span>
          <span
            onClick={() => {
              setCurrentForm("status");
            }}
            className={`text-center w-full font-semibold py-2 md:py-4 border-black text-sm md:text-base  hover:bg-black/5 ${
              currentForm === "status" ? "border-b-2" : ""
            } `}
          >
            SET STATUS
          </span>
          <span
            onClick={() => {
              setCurrentForm("userList");
            }}
            className={`text-center xl:hidden w-full font-semibold py-2 md:py-4 border-black text-sm md:text-base   hover:bg-black/5 ${
              currentForm === "userList" ? "border-b-2" : ""
            } `}
          >
            USER LIST
          </span>
        </div>
        <div className="h-full">
          {currentForm === "name" && <NameChangeForm setIsOpen={setIsOpen} />}
          {currentForm === "status" && (
            <StatusChangeForm setIsOpen={setIsOpen} />
          )}
          {currentForm === "userList" && (
            <>
              <div className="xl:hidden">
                <ConnectedUsersList />
              </div>

              <div className="hidden w-full   xl:flex ">
                <button
                  onClick={() => {
                    setCurrentForm("name");
                  }}
                  className="bg-green-500 text-white p-2 md:p-3 w-full font-bold"
                >
                  FIX
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PopUp;

function NameChangeForm({ setIsOpen }) {
  const socket = useSocketContext();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const newName = e.target[0].value;
    if (newName) socket.emit("changeName", newName);
    e.target[0].value = "";
    setIsOpen(false);
  };
  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmitHandler}>
      <div>
        <label className=" font-semibold  text-base md:text-xl">NAME</label>
        <br />
        <input
          className="outline-none bg-gray-200 p-2 md:p-3 mt-2 w-full placeholder:font-semibold   "
          placeholder="Enter display name"
          type="text"
        />
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white p-2 md:p-3 font-bold"
      >
        CHANGE
      </button>
    </form>
  );
}
function StatusChangeForm({ setIsOpen }) {
  const [localStatus, setLocalStatus] = useState("online");
  const { setStatus } = useStateContext();

  const socket = useSocketContext();
  const onSubmitHandler = (e) => {
    e.preventDefault();
    socket.emit("changeStatus", localStatus);
    setStatus(localStatus);
    setIsOpen(false);
  };
  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmitHandler}>
      <div>
        <label className="font-semibold  text-base md:text-xl">STATUS</label>
        <br />
        <div className="flex gap-2 mt-3">
        <span
            onClick={() => {
              setLocalStatus("online");
            }}
            className={`p-2 md:p-4 w-1/2 flex justify-center border rounded-md hover:bg-black/5 items-center gap-2 font-bold ${
              localStatus === "online" ? "ring-2 ring-offset-2 " : ""
            } `}
          >
            <MdMotionPhotosOn className="w-7 h-7" fill="limegreen" /> Online
          </span>
          <span
            onClick={() => {
              setLocalStatus("offline");
            }}
            className={`p-2 md:p-4 w-1/2 flex justify-center border rounded-md hover:bg-black/5 items-center gap-2 font-bold ${
              localStatus === "offline" ? "ring-2 ring-offset-4 " : ""
            } `}
          >
            <MdMotionPhotosOff className="w-7 h-7  " fill="red" /> Offline
          </span>
       
        </div>
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white p-2 md:p-4 font-bold"
      >
        APPLY
      </button>
    </form>
  );
}
