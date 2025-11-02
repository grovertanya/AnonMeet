import { Server } from "socket.io";

let io;
let server;

export async function GET(request) {
  if (!server) {
    // Create a new HTTP server only once
    server = require("http").createServer();
    io = new Server(server, {
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("✅ New client connected:", socket.id);

      socket.on("join", (roomId) => {
        socket.join(roomId);
        console.log(`Client ${socket.id} joined room ${roomId}`);
      });

      socket.on("offer", (offer, roomId) => {
        socket.to(roomId).emit("offer", offer);
      });

      socket.on("answer", (answer, roomId) => {
        socket.to(roomId).emit("answer", answer);
      });

      socket.on("candidate", (candidate, roomId) => {
        socket.to(roomId).emit("candidate", candidate);
      });

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
      });
    });
  }

  return new Response("Socket.io server running", { status: 200 });
}
