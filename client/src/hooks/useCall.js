import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import socket from "../services/socket";

const useCall = (currentUserId) => {
  const [callState, setCallState] = useState({
    isReceivingCall: false,
    isCalling: false,
    callAccepted: false,
    callEnded: false,
    caller: null,
    incomingCall: null,
    callType: "video",
    remoteStream: null, // NEW — stream state mein rakho
  });

  const myVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);

  const getUnmutedStream = async (callType) => {
    const firstStream = await navigator.mediaDevices.getUserMedia({
      video: callType === "video",
      audio: true,
    });
    firstStream.getTracks().forEach((t) => t.stop());

    await new Promise((resolve) => setTimeout(resolve, 300));

    const freshStream = await navigator.mediaDevices.getUserMedia({
      video: callType === "video",
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
    });

    const audioTrack = freshStream.getAudioTracks()[0];
    console.log("=== FRESH STREAM DEBUG ===");
    console.log("Audio muted:", audioTrack?.muted);
    console.log("Audio enabled:", audioTrack?.enabled);
    console.log("Audio readyState:", audioTrack?.readyState);

    return freshStream;
  };

  useEffect(() => {
    if (!currentUserId) return;

    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    if (socket.connected) socket.disconnect();
    socket.connect();
    socket.emit("register", currentUserId);

    const peerId = `${currentUserId}_${Date.now()}`;
    const isProduction = import.meta.env.PROD;

    const peer = new Peer(peerId, {
      host: isProduction ? "medkit-0snh.onrender.com" : "localhost",
      port: isProduction ? 443 : 5000,
      path: "/peerjs",
      secure: isProduction,
      config: {
        iceServers: [
          { urls: "stun:stun.relay.metered.ca:80" },
          {
            urls: "turn:global.relay.metered.ca:80",
            username: "a4214d3f77ee871a4780fc4e",
            credential: "sE5EKTxyYGYvKdz8",
          },
          {
            urls: "turn:global.relay.metered.ca:80?transport=tcp",
            username: "a4214d3f77ee871a4780fc4e",
            credential: "sE5EKTxyYGYvKdz8",
          },
          {
            urls: "turn:global.relay.metered.ca:443",
            username: "a4214d3f77ee871a4780fc4e",
            credential: "sE5EKTxyYGYvKdz8",
          },
          {
            urls: "turns:global.relay.metered.ca:443?transport=tcp",
            username: "a4214d3f77ee871a4780fc4e",
            credential: "sE5EKTxyYGYvKdz8",
          },
        ],
      },
    });

    peerRef.current = peer;

    peer.on("open", (id) => {
      console.log("PeerJS connected with ID:", id);
      socket.emit("register_peer", { userId: currentUserId, peerId: id });
    });

    peer.on("call", (call) => {
      const incomingCallType = call.metadata?.callType || "audio";
      setCallState((prev) => ({
        ...prev,
        isReceivingCall: true,
        incomingCall: call,
        callType: incomingCallType,
      }));
    });

    peer.on("error", (err) => {
      console.error("PeerJS error:", err.type, err.message);
    });

    socket.on("call:incoming", ({ callerId, callerName, callerPeerId, callType }) => {
      setCallState((prev) => ({
        ...prev,
        caller: { id: callerId, name: callerName, peerId: callerPeerId },
        callType: callType,
      }));
    });

    socket.on("call:rejected", () => {
      alert("Doctor ne call reject kar diya");
      endCall();
    });

    socket.on("call:ended", () => {
      endCall();
    });

    return () => {
      socket.off("call:incoming");
      socket.off("call:rejected");
      socket.off("call:ended");
      socket.disconnect();
      peer.destroy();
      peerRef.current = null;
    };
  }, [currentUserId]);

  const initiateCall = async (doctorId, doctorName, callType = "video") => {
    try {
      const stream = await getUnmutedStream(callType);
      streamRef.current = stream;

      if (callType === "video" && myVideo.current) {
        myVideo.current.srcObject = stream;
      }

      setCallState((prev) => ({
        ...prev,
        isCalling: true,
        callType,
        caller: { id: doctorId, name: doctorName },
      }));

      socket.emit("get_peer_id", { userId: doctorId });

      socket.once("peer_id_response", ({ peerId: doctorPeerId }) => {
        if (!doctorPeerId) {
          alert("Doctor abhi available nahi hai");
          endCall();
          return;
        }

        socket.emit("call:initiate", {
          callerId: currentUserId,
          callerPeerId: peerRef.current?.id,
          doctorId,
          callerName: localStorage.getItem("userName") || "Patient",
          callType,
        });

        const call = peerRef.current.call(doctorPeerId, stream, {
          metadata: { callType },
        });

        call.on("stream", (remoteStream) => {
          console.log("=== REMOTE STREAM RECEIVED ===");
          console.log("Audio tracks:", remoteStream.getAudioTracks());
          console.log("Audio enabled:", remoteStream.getAudioTracks()[0]?.enabled);

          // ✅ ref + state dono mein save karo
          if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
          setCallState((prev) => ({
            ...prev,
            callAccepted: true,
            remoteStream,
          }));
        });

        call.on("close", () => endCall());
      });
    } catch (err) {
      console.error(err);
      alert("Camera ya microphone access do");
    }
  };

  const acceptCall = async (callType = "audio") => {
    try {
      const stream = await getUnmutedStream(callType);
      streamRef.current = stream;

      if (callType === "video" && myVideo.current) {
        myVideo.current.srcObject = stream;
      }

      const call = callState.incomingCall;

      // ✅ Pehle event listen karo, phir answer
      call.on("stream", (remoteStream) => {
        console.log("=== DOCTOR RECEIVED PATIENT STREAM ===");
        console.log("Audio tracks:", remoteStream.getAudioTracks());
        console.log("Audio enabled:", remoteStream.getAudioTracks()[0]?.enabled);

        // ✅ ref + state dono mein save karo
        if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
        setCallState((prev) => ({
          ...prev,
          remoteStream, // ← CallScreen directly yahan se stream lega
        }));
      });

      call.on("close", () => endCall());

      call.answer(stream);

      console.log("=== DOCTOR STREAM SENDING ===");
      console.log("Doctor audio muted:", stream.getAudioTracks()[0]?.muted);
      console.log("Doctor audio enabled:", stream.getAudioTracks()[0]?.enabled);

      socket.emit("call:accept", { callerId: callState.caller?.id });

      setCallState((prev) => ({
        ...prev,
        callAccepted: true,
        callType,
        isReceivingCall: false,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const rejectCall = () => {
    socket.emit("call:reject", { callerId: callState.caller?.id });
    setCallState((prev) => ({
      ...prev,
      isReceivingCall: false,
      incomingCall: null,
      caller: null,
    }));
  };

  const endCall = (otherUserId) => {
    if (otherUserId) {
      socket.emit("call:end", { otherUserId });
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (myVideo.current) myVideo.current.srcObject = null;
    if (remoteVideo.current) remoteVideo.current.srcObject = null;
    setCallState({
      isReceivingCall: false,
      isCalling: false,
      callAccepted: false,
      callEnded: true,
      caller: null,
      incomingCall: null,
      callType: "video",
      remoteStream: null,
    });
  };

  return {
    callState,
    myVideo,
    remoteVideo,
    initiateCall,
    acceptCall,
    rejectCall,
    endCall,
  };
};

export default useCall;
