import { io } from "socket.io-client";

const socket = io({
  path: "/api/socket",
});

socket.emit("join-room", "room-123");
socket.on("signal", (data) => console.log("Got signal:", data));
