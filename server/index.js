const express = require("express");
const { createServer } = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

let users = [];

const app = express();
const server = createServer(app);

const io = new Server(server, { connectionStateRecovery: {}, cors: {} });

app.use(cors());



app.get("/", (req, res) => {
  res.send("working !");
});

io.on("connection", (socket) => {
  console.log("User connected with id : ", socket.id);

  users.push({
    user: "",
    id: socket.id,
    status: "online",
  });

  io.emit("initialInfo", users);

  socket.on("getInitialInfo", () => {
    socket.emit("initialInfo", users);
  });

  socket.on("changeName", (msg) => {
    const index = users.findIndex((e) => e.id === socket.id);
    users[index].user = msg;
    io.emit("userInfoChanged", users);
  });

  socket.on("changeStatus", (msg) => {
    const index = users.findIndex((e) => e.id === socket.id);
    users[index].status = msg;
    io.emit("userInfoChanged", users);
  });

  socket.on("message", (msg) => {
    let user = "";
    io.emit("message", msg, socket.id, user);
    console.log("Message Received");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected with id : ", socket.id);
    users = users.filter((e) => e.id != socket.id);
    io.emit("userInfoChanged", users);
  });
});

server.listen(3000, () => {
  console.log("Server is live on http://localhost:3000 .");
});
