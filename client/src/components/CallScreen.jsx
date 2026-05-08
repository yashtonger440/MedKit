import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FaMicrophone, FaMicrophoneSlash,
  FaVideo, FaVideoSlash, FaPhone
} from "react-icons/fa";

const CallScreen = ({
  myVideo,
  remoteVideo,
  remoteStream,
  myStream,
  onEndCall,
  callerName,
  callAccepted,
  callType,
}) => {
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // myStream se apna video attach karo
  useEffect(() => {
    if (!myStream) return;
    if (!myVideo?.current) return;
    myVideo.current.srcObject = myStream;
  }, [myStream]);

  // Call duration timer
  useEffect(() => {
    if (!callAccepted) return;
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callAccepted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Audio call ke liye remoteStream attach karo
  useEffect(() => {
    if (callType !== "audio") return;
    if (!remoteStream) return;
    if (!audioRef.current) return;
    audioRef.current.srcObject = remoteStream;
    audioRef.current
      .play()
      .then(() => console.log("✅ Audio playing successfully"))
      .catch((e) => {
        if (e.name !== "AbortError") console.error("Audio error:", e);
      });
  }, [remoteStream, callType]);

  // Video call ke liye remoteVideo ref pe stream lagao
  useEffect(() => {
    if (callType !== "video") return;
    if (!remoteStream) return;
    if (!remoteVideo?.current) return;
    remoteVideo.current.srcObject = remoteStream;
  }, [remoteStream, callType]);

  const toggleMute = () => {
    const stream = myVideo.current?.srcObject;
    if (stream) {
      stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
      setMuted(!muted);
    }
  };

  const toggleVideo = () => {
    const stream = myVideo.current?.srcObject;
    if (stream) {
      stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
      setVideoOff(!videoOff);
    }
  };

  // ✅ FIX — React Portal se document.body mein render karo
  // WHY: Sidebar ka md:ml-60 aur z-index CallScreen ko clip kar raha tha desktop pe
  // Portal se CallScreen kisi bhi parent div ke CSS se affect nahi hogi
  // Yeh bilkul alag DOM node mein render hogi — pure fullscreen
  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#111827",
      }}
    >
      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", backgroundColor: "rgba(0,0,0,0.3)" }}>
        <p style={{ color: "white", fontWeight: 600, fontSize: "18px" }}>{callerName}</p>
        {callAccepted && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", padding: "4px 12px", borderRadius: "999px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#4ade80", animation: "pulse 2s infinite" }} />
            <span style={{ color: "#86efac", fontSize: "14px", fontFamily: "monospace", fontWeight: 500 }}>
              {formatTime(duration)}
            </span>
          </div>
        )}
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {callType === "audio" ? (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "128px", height: "128px", borderRadius: "50%", backgroundColor: "#a855f7", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "48px", fontWeight: 700, marginBottom: "24px" }}>
              {callerName?.[0]?.toUpperCase() || "D"}
            </div>
            <p style={{ color: "white", fontSize: "24px", fontWeight: 600 }}>{callerName}</p>
            <p style={{ color: "#9ca3af", marginTop: "8px" }}>
              {callAccepted ? "🔊 Audio Call Connected" : "Calling..."}
            </p>
            <audio ref={audioRef} autoPlay playsInline style={{ display: "none" }} />
          </div>
        ) : (
          <>
            {callAccepted ? (
              <video ref={remoteVideo} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "96px", height: "96px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "36px", fontWeight: 700, marginBottom: "16px" }}>
                  {callerName?.[0]?.toUpperCase() || "D"}
                </div>
                <p style={{ color: "white", fontSize: "20px", fontWeight: 600 }}>{callerName}</p>
                <p style={{ color: "#9ca3af", marginTop: "8px" }}>Calling...</p>
              </div>
            )}

            {/* My Video corner */}
            <div style={{ position: "absolute", bottom: "96px", right: "16px", width: "128px", height: "176px", borderRadius: "16px", overflow: "hidden", border: "2px solid white", boxShadow: "0 10px 25px rgba(0,0,0,0.5)", zIndex: 10 }}>
              <video ref={myVideo} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </>
        )}
      </div>

      {/* ✅ Controls — inline styles use kiye */}
      {/* WHY: Tailwind classes parent ke CSS se override ho sakti thi */}
      {/* Inline styles guaranteed kaam karti hain — koi conflict nahi */}
      <div style={{
        backgroundColor: "rgba(31,41,55,0.97)",
        backdropFilter: "blur(8px)",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        borderTop: "1px solid rgba(75,85,99,0.5)",
        minHeight: "88px",
      }}>
        {/* Mute Button */}
        <button
          onClick={toggleMute}
          style={{
            width: "56px", height: "56px", borderRadius: "50%",
            backgroundColor: muted ? "#ef4444" : "#4b5563",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          {muted
            ? <FaMicrophoneSlash size={20} color="white" />
            : <FaMicrophone size={20} color="white" />
          }
        </button>

        {/* End Call Button */}
        <button
          onClick={onEndCall}
          style={{
            width: "64px", height: "64px", borderRadius: "50%",
            backgroundColor: "#ef4444",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
            boxShadow: "0 8px 25px rgba(239,68,68,0.4)",
          }}
        >
          <FaPhone size={22} color="white" style={{ transform: "rotate(135deg)" }} />
        </button>

        {/* Video Toggle */}
        {callType === "video" && (
          <button
            onClick={toggleVideo}
            style={{
              width: "56px", height: "56px", borderRadius: "50%",
              backgroundColor: videoOff ? "#ef4444" : "#4b5563",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            {videoOff
              ? <FaVideoSlash size={20} color="white" />
              : <FaVideo size={20} color="white" />
            }
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

export default CallScreen;
