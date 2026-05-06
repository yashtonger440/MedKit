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
  });

  const myVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!currentUserId) return;

    // ✅ Pehle purana peer destroy karo
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    // ✅ Socket disconnect karke fresh connect karo
    if (socket.connected) socket.disconnect();
    socket.connect();
    socket.emit("register", currentUserId);

    // ✅ Random suffix add karo PeerID mein — conflict avoid karo
    const peerId = `${currentUserId}_${Date.now()}`;

    const isProduction = import.meta.env.PROD;

    const peer = new Peer(peerId, {
      host: isProduction ? "medkit-0snh.onrender.com" : "localhost",
      port: isProduction ? 443 : 5000,
      path: "/peerjs",
      secure: isProduction,
      config: {
        iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      {
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443?transport=tcp",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
        ],
      },
    });

    peerRef.current = peer;

    // Doctor ka dynamic peerId register karo socket pe
    peer.on("open", (id) => {
      console.log("PeerJS connected with ID:", id);
      // Socket pe dynamic ID bhi register karo
      socket.emit("register_peer", { userId: currentUserId, peerId: id });
    });

    // Incoming call
    peer.on("call", (call) => {
      setCallState((prev) => ({
        ...prev,
        isReceivingCall: true,
        incomingCall: call,
      }));
    });

    peer.on("error", (err) => {
      console.error("PeerJS error:", err.type, err.message);
    });

    // Socket events
    socket.on(
      "call:incoming",
      ({ callerId, callerName, callerPeerId, callType }) => {
        setCallState((prev) => ({
          ...prev,
          caller: { id: callerId, name: callerName, peerId: callerPeerId },
          callType: callType,
        }));
      },
    );

    socket.on("call:rejected", () => {
      alert("Doctor ne call reject kar diya");
      endCall();
    });

    socket.on("call:ended", () => {
      endCall();
    });

    // ✅ Cleanup on unmount
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === "video",
        audio: true,
      });

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

      // Doctor ka peerId socket se lo
      socket.emit("get_peer_id", { userId: doctorId });

      socket.once("peer_id_response", ({ peerId: doctorPeerId }) => {
        if (!doctorPeerId) {
          alert("Doctor abhi available nahi hai");
          endCall();
          return;
        }

        // Socket se doctor ko notify karo
        socket.emit("call:initiate", {
          callerId: currentUserId,
          callerPeerId: peerRef.current?.id,
          doctorId,
          callerName: localStorage.getItem("userName") || "Patient",
          callType,
        });

        // PeerJS se call karo doctor ke peerId pe
        const call = peerRef.current.call(doctorPeerId, stream);

        call.on("stream", (remoteStream) => {
          if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
          setCallState((prev) => ({ ...prev, callAccepted: true }));
        });

        call.on("close", () => endCall());
      });
    } catch (err) {
      console.error(err);
      alert("Camera ya microphone access do");
    }
  };

  const acceptCall = async (callType = "video") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === "video",
        audio: true,
      });

      streamRef.current = stream;

      if (callType === "video" && myVideo.current) {
        myVideo.current.srcObject = stream;
      }

      const call = callState.incomingCall;
      call.answer(stream);

      call.on("stream", (remoteStream) => {
        if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
      });

      call.on("close", () => endCall());

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
