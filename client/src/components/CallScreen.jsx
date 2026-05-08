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
    if (!myStream || !myVideo?.current) return;
    myVideo.current.srcObject = myStream;
  }, [myStream]);

  // Call duration timer
  useEffect(() => {
    if (!callAccepted) return;
    const interval = setInterval(() => setDuration((p) => p + 1), 1000);
    return () => clearInterval(interval);
  }, [callAccepted]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  // Audio remoteStream attach
  useEffect(() => {
    if (callType !== "audio" || !remoteStream || !audioRef.current) return;
    audioRef.current.srcObject = remoteStream;
    audioRef.current.play().catch((e) => {
      if (e.name !== "AbortError") console.error("Audio error:", e);
    });
  }, [remoteStream, callType]);

  // Video remoteStream attach
  useEffect(() => {
    if (callType !== "video" || !remoteStream || !remoteVideo?.current) return;
    remoteVideo.current.srcObject = remoteStream;
  }, [remoteStream, callType]);

  // ✅ myStream directly use karo — myVideo.current?.srcObject null hota tha
  const toggleMute = () => {
    if (!myStream) return;
    const tracks = myStream.getAudioTracks();
    if (!tracks.length) return;
    const newMuted = !muted;
    tracks.forEach((t) => (t.enabled = !newMuted));
    setMuted(newMuted);
  };

  const toggleVideo = () => {
    if (!myStream) return;
    const tracks = myStream.getVideoTracks();
    if (!tracks.length) return;
    const newVideoOff = !videoOff;
    tracks.forEach((t) => (t.enabled = !newVideoOff));
    setVideoOff(newVideoOff);
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex flex-col bg-gray-900">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/30">
        <p className="text-white font-semibold text-lg">{callerName}</p>
        {callAccepted && (
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 px-3 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-300 text-sm font-mono font-medium">
              {formatTime(duration)}
            </span>
          </div>
        )}
      </div>

      {/* ── Main Area ── */}
      <div className="flex-1 relative overflow-hidden">
        {callType === "audio" ? (

          /* Audio Call UI */
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-6 transition-colors duration-300 ${muted ? "bg-gray-500" : "bg-purple-500"}`}>
              {callerName?.[0]?.toUpperCase() || "D"}
            </div>
            <p className="text-white text-2xl font-semibold">{callerName}</p>
            <p className="text-gray-400 mt-2">
              {callAccepted ? (muted ? "🔇 Muted" : "🔊 Audio Call Connected") : "Calling..."}
            </p>
            <audio ref={audioRef} autoPlay playsInline className="hidden" />
          </div>

        ) : (

          /* Video Call UI */
          <>
            {callAccepted ? (
              <video
                ref={remoteVideo}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold mb-4 animate-pulse">
                  {callerName?.[0]?.toUpperCase() || "D"}
                </div>
                <p className="text-white text-xl font-semibold">{callerName}</p>
                <p className="text-gray-400 mt-2 animate-pulse">Calling...</p>
              </div>
            )}

            {/* My Video — corner */}
            <div className="absolute bottom-24 right-4 w-32 h-44 rounded-2xl overflow-hidden border-2 border-white shadow-lg z-10">
              {videoOff ? (
                <div className="w-full h-full bg-gray-700 flex flex-col items-center justify-center gap-2">
                  <FaVideoSlash size={24} className="text-gray-400" />
                  <span className="text-gray-400 text-xs">Camera Off</span>
                </div>
              ) : (
                <video
                  ref={myVideo}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Controls ── */}
      <div className="bg-gray-900/95 backdrop-blur-sm px-8 py-5 flex items-center justify-center gap-8 border-t border-gray-700 min-h-[88px]">

        {/* Mute Button */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 border-2
              ${muted
                ? "bg-red-500 border-red-300 shadow-lg shadow-red-500/40 scale-95"
                : "bg-gray-600 border-gray-500 hover:bg-gray-500"
              }`}
          >
            {muted
              ? <FaMicrophoneSlash size={20} className="text-white" />
              : <FaMicrophone size={20} className="text-white" />
            }
          </button>
          <span className={`text-xs ${muted ? "text-red-300" : "text-gray-400"}`}>
            {muted ? "Unmute" : "Mute"}
          </span>
        </div>

        {/* End Call Button */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={onEndCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-200 shadow-lg shadow-red-500/40 hover:scale-105"
          >
            <FaPhone size={22} className="text-white" style={{ transform: "rotate(135deg)" }} />
          </button>
          <span className="text-xs text-red-300">End Call</span>
        </div>

        {/* Video Toggle */}
        {callType === "video" && (
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={toggleVideo}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 border-2
                ${videoOff
                  ? "bg-red-500 border-red-300 shadow-lg shadow-red-500/40 scale-95"
                  : "bg-gray-600 border-gray-500 hover:bg-gray-500"
                }`}
            >
              {videoOff
                ? <FaVideoSlash size={20} className="text-white" />
                : <FaVideo size={20} className="text-white" />
              }
            </button>
            <span className={`text-xs ${videoOff ? "text-red-300" : "text-gray-400"}`}>
              {videoOff ? "Start Video" : "Stop Video"}
            </span>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default CallScreen;
