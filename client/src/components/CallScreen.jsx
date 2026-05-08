import { useState, useRef, useEffect } from "react";
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
  const [duration, setDuration] = useState(0); // ✅ Timer state — seconds mein
  const audioRef = useRef(null);

  // ✅ CHANGE 1 — myStream se apna video attach karo
  useEffect(() => {
    if (!myStream) return;
    if (!myVideo?.current) return;
    myVideo.current.srcObject = myStream;
  }, [myStream]);

  // ✅ CHANGE 2 — Call duration timer
  useEffect(() => {
    if (!callAccepted) return;

    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [callAccepted]);

  // ✅ Timer ko MM:SS format mein convert karo
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ✅ CHANGE 3 — Audio call ke liye remoteStream attach karo
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

  // ✅ Video call ke liye remoteVideo ref pe stream lagao
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

  return (
    // ✅ CHANGE 4 — poora screen fixed hai
    <div className="fixed inset-0 bg-gray-900 z-[999] flex flex-col">

      {/* ── Top Bar — caller name + timer ── */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/30">
        <p className="text-white font-semibold text-lg">{callerName}</p>

        {/* ✅ CHANGE 5 — Timer display */}
        {callAccepted && (
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 px-3 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-300 text-sm font-mono font-medium">
              {formatTime(duration)}
            </span>
          </div>
        )}
      </div>

      {/* ── Main Video/Audio Area ── */}
      <div className="flex-1 relative overflow-hidden">
        {callType === "audio" ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-purple-500 flex items-center justify-center text-white text-5xl font-bold mb-6">
              {callerName?.[0]?.toUpperCase() || "D"}
            </div>
            <p className="text-white text-2xl font-semibold">{callerName}</p>
            <p className="text-gray-400 mt-2">
              {callAccepted ? "🔊 Audio Call Connected" : "Calling..."}
            </p>
            <audio
              ref={audioRef}
              autoPlay
              playsInline
              style={{ display: "none" }}
            />
          </div>
        ) : (
          <>
            {/* Remote Video — full screen */}
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

            {/* ✅ My Video — corner mein */}
            {/* WHY: muted={true} apni awaaz echo avoid karne ke liye */}
            <div className="absolute bottom-24 right-4 w-32 h-44 rounded-2xl overflow-hidden border-2 border-white shadow-lg z-10">
              <video
                ref={myVideo}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </>
        )}
      </div>

      {/* ✅ CHANGE 6 — Controls bottom pe fixed hain */}
      <div className="bg-gray-800/95 backdrop-blur-sm px-8 py-5 flex items-center justify-center gap-6 border-t border-gray-700">

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            muted ? "bg-red-500 scale-95" : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          {muted
            ? <FaMicrophoneSlash size={20} className="text-white" />
            : <FaMicrophone size={20} className="text-white" />
          }
        </button>

        {/* End Call Button */}
        <button
          onClick={onEndCall}
          className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all hover:scale-105 shadow-lg shadow-red-500/30"
        >
          <FaPhone size={22} className="text-white" style={{ transform: "rotate(135deg)" }} />
        </button>

        {/* Video Toggle — sirf video call mein */}
        {callType === "video" && (
          <button
            onClick={toggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              videoOff ? "bg-red-500 scale-95" : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            {videoOff
              ? <FaVideoSlash size={20} className="text-white" />
              : <FaVideo size={20} className="text-white" />
            }
          </button>
        )}
      </div>
    </div>
  );
};

export default CallScreen;
