"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function Page() {
  const [roomId, setRoomId] = useState("default-room");
  const [joined, setJoined] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    // initialize socket only once
    socketRef.current = io({
      path: "/api/socket",
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
    });

    // handle signaling messages
    socketRef.current.on("signal", async (data: any) => {
      if (!peerRef.current) return;
      if (data.signal.type === "offer") {
        await peerRef.current.setRemoteDescription(data.signal);
        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(answer);
        socketRef.current.emit("signal", {
          roomId,
          signal: answer,
        });
      } else if (data.signal.type === "answer") {
        await peerRef.current.setRemoteDescription(data.signal);
      } else if (data.signal.candidate) {
        await peerRef.current.addIceCandidate(data.signal.candidate);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const joinRoom = async () => {
    if (!socketRef.current) return;
    socketRef.current.emit("join-room", roomId);
    setJoined(true);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerRef.current = peer;

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("signal", {
          roomId,
          signal: { candidate: event.candidate },
        });
      }
    };

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    socketRef.current.emit("signal", {
      roomId,
      signal: offer,
    });
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <h1 className="text-2xl font-semibold">AnonMeet 🎥</h1>

      {!joined ? (
        <div className="flex space-x-2">
          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="border p-2 rounded"
            placeholder="Room ID"
          />
          <button
            onClick={joinRoom}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Join
          </button>
        </div>
      ) : (
        <p className="text-gray-600">Joined room: {roomId}</p>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="rounded-xl border w-[320px] h-[240px]"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="rounded-xl border w-[320px] h-[240px]"
        />
      </div>
    </div>
  );
}
