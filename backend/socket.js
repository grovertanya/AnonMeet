const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  path: "/socket",
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join-room", (roomId) => {
    console.log(`Socket ${socket.id} joining room ${roomId}`);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    rooms[roomId].push(socket.id);
    socket.join(roomId);

    socket.to(roomId).emit("user-connected", socket.id);

    // Send back existing users in room (except self)
    const otherUsers = rooms[roomId].filter((id) => id !== socket.id);
    socket.emit("all-users", otherUsers);

    socket.on("offer", (payload) => {
      // payload: { target: socketId, sdp }
      io.to(payload.target).emit("offer", {
        sdp: payload.sdp,
        caller: socket.id,
      });
    });

    socket.on("answer", (payload) => {
      // payload: { target: socketId, sdp }
      io.to(payload.target).emit("answer", {
        sdp: payload.sdp,
        responder: socket.id,
      });
    });

    socket.on("ice-candidate", (payload) => {
      // payload: { target: socketId, candidate }
      io.to(payload.target).emit("ice-candidate", {
        candidate: payload.candidate,
        from: socket.id,
      });
    });

    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);
      // Remove user from room
      if (rooms[roomId]) {
        rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
        // Notify others in room
        socket.to(roomId).emit("user-disconnected", socket.id);

        // Clean up if empty
        if (rooms[roomId].length === 0) {
          delete rooms[roomId];
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));