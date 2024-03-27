import Chat from "./components/chat";
import ConnectedUsersList from "./components/connected-users-list";
import SocketContextProvider from "./context/socket-context";
import StatusContextProvider from "./context/status-context";

function App() {
  return (
    <StatusContextProvider>
      <SocketContextProvider>
        <div className="h-full w-full flex">
          <Chat />
          <ConnectedUsersList />
        </div>
      </SocketContextProvider>
    </StatusContextProvider>
  );
}

export default App;
