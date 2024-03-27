import React, { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa6";
import { RiRadioButtonLine } from "react-icons/ri";
import { useSocketContext } from "../context/socket-context";

function ConnectedUsersList() {
  const [users, setUsers] = useState([]);

  const socket = useSocketContext();

  useEffect(() => {
    if (socket) {
      socket.on("initialInfo", (userList) => {
        const filteredList = userList.filter((e) => e.id !== socket.id);
        setUsers(filteredList);
      });

      socket.emit("getInitialInfo");

      socket.on("userInfoChanged", (userList) => {
        const filteredList = userList.filter((e) => e.id !== socket.id);
        setUsers(filteredList);
      });
    }
    return () => {
      if (socket) {
        socket.off("userInfoChanged");
        socket.off("initialInfo");
      }
    };
  }, [socket]);

  return (
    <div className="hidden  xl:w-1/4 h-full xl:flex flex-col bg-slate-500 ">
      <div className=" bg-white flex items-center gap-4 px-6 py-3 text-3xl ">
        <FaUsers className="w-7 h-7" />
        CONNECTED USERS
      </div>
      <div className="flex-grow flex flex-col gap-3 p-4">
        {users.map((user) => (
          <div
            key={user.id + user.status}
            className="bg-white p-2 rounded-md flex items-center gap-2"
          >
            <RiRadioButtonLine
              fill={user.status === "online" ? "limegreen" : "red"}
            />
            <div>
              <span className="font-semibold">
                {user.user ? user.user : "User"}
              </span>
              <p className="text-xs text-gray-400">{user.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConnectedUsersList;
