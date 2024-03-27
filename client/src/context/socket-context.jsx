import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = React.createContext(null);

export function useSocketContext() {
  return useContext(SocketContext);
}

function SocketContextProvider({ children }) {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const Socket = io("ws://localhost:3000");
    Socket.on("connect", () => {
      console.log("Connected to server .");
      setSocket(Socket);
    });

    return ()=>{
        Socket.close()
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export default SocketContextProvider;
