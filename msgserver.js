const express = require('express');
const http = require('http');
// const cors = require('cors');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*"
    },
});

app.use(express.static(__dirname));

io.on("connection", (socket) => {
  console.log("🟢 Client connected");

  socket.on("join room", (roomID) => {
    socket.join(roomID);
    console.log(`${socket.id} joined room: ${roomID}`);
  })

  socket.on("chat message", ({roomID, msg, currentUser}) => {
    console.log(`received message: ${msg}, from: ${currentUser}, room id: ${roomID}`);
    socket.to(roomID).emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
  });
});

server.listen(3000, () => console.log("server running on http://127.0.0.1:3000"));

