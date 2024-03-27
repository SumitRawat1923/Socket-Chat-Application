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
          <div className="hidden xl:flex xl:w-1/4">
            <ConnectedUsersList />
          </div>
        </div>
      </SocketContextProvider>
    </StatusContextProvider>
  );
}

export default App;
