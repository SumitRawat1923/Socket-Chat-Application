import React, { useContext, useState } from "react";

const StatusContext = React.createContext();

export function useStateContext() {
  return useContext(StatusContext);
}

function StatusContextProvider({ children }) {
  const [status, setStatus] = useState("online");
  return (
    <StatusContext.Provider value={{ status, setStatus }}>
      {children}
    </StatusContext.Provider>
  );
}

export default StatusContextProvider;
