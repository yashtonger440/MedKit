import { useState, useEffect, useRef } from "react";
import {
  FaMicrophone, FaMicrophoneSlash,
  FaVideo, FaVideoSlash, FaPhone
} from "react-icons/fa";

const CallScreen = ({ myVideo, remoteVideo, onEndCall, callerName, callAccepted, callType }) => {
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  // ✅ FIX — audio call ke liye alag local ref banao
  // remoteVideo ref video element pe point karta hai
  // Android Chrome mein audio element alag ref chahiye
  const audioRef = useRef(null);

  useEffect(() => {
    if (callType !== "audio") return;
    if (!callAccepted) return;

    // remoteVideo.current pe stream already set hai useCall.js se
    // Hum woh stream audioRef pe lagaate hain
    const tryAttach = () => {
      const stream = remoteVideo?.current?.srcObject;

      if (stream && audioRef.current) {
        audioRef.current.srcObject = stream;
        audioRef.current
          .play()
          .then(() => console.log("✅ Audio playing successfully"))
          .catch((e) => console.log("❌ Audio play error:", e));
      } else {
        // Stream abhi nahi aayi — thodi der baad try karo
        setTimeout(tryAttach, 300);
      }
    };

    tryAttach();
  }, [callAccepted, callType]);

  // ✅ remoteVideo ki stream watch karo — jab bhi set ho audioRef pe lagao
  useEffect(() => {
    if (callType !== "audio") return;

    const interval = setInterval(() => {
      const stream = remoteVideo?.current?.srcObject;
      if (stream && audioRef.current && audioRef.current.srcObject !== stream) {
        audioRef.current.srcObject = stream;
        audioRef.current
          .play()
          .then(() => {
            console.log("✅ Audio attached via interval");
            clearInterval(interval);
          })
          .catch((e) => console.log("Audio attach error:", e));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [callType]);

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
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">

      {/* Remote Video / Audio */}
      <div className="flex-1 relative">
        {callType === "audio" ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-purple-500 flex items-center justify-center text-white text-5xl font-bold mb-6">
              {callerName?.[0]?.toUpperCase() || "D"}
            </div>
            <p className="text-white text-2xl font-semibold">{callerName}</p>
            <p className="text-gray-400 mt-2">
              {callAccepted ? "🔊 Audio Call Connected" : "Calling..."}
            </p>

            {/* ✅ FIX — remoteVideo hidden div mein rakho stream hold karne ke liye */}
            {/* audioRef se actual playback hoga */}
            <div style={{ display: "none" }}>
              <video ref={remoteVideo} autoPlay playsInline />
            </div>

            {/* ✅ Yeh actual audio play karega */}
            <audio
              ref={audioRef}
              autoPlay
              playsInline
              style={{ display: "none" }}
            />
          </div>
        ) : (
          <>
            {callAccepted ? (
              <video
                ref={remoteVideo}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                // ✅ muted bilkul mat likhna — remote ki awaaz band ho jaayegi
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
                  {callerName?.[0]?.toUpperCase() || "D"}
                </div>
                <p className="text-white text-xl font-semibold">{callerName}</p>
                <p className="text-gray-400 mt-2 animate-pulse">Calling...</p>
              </div>
            )}

            {/* My Video — corner — muted ZAROORI (echo avoid) */}
            <div className="absolute bottom-4 right-4 w-32 h-44 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
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

      {/* Controls */}
      <div className="bg-gray-800 px-8 py-6 flex items-center justify-center gap-6">
        <button
          onClick={toggleMute}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
            muted ? "bg-red-500" : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          {muted
            ? <FaMicrophoneSlash size={20} className="text-white" />
            : <FaMicrophone size={20} className="text-white" />
          }
        </button>

        <button
          onClick={onEndCall}
          className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition"
        >
          <FaPhone size={22} className="text-white" style={{ transform: "rotate(135deg)" }} />
        </button>

        {callType === "video" && (
          <button
            onClick={toggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
              videoOff ? "bg-red-500" : "bg-gray-600 hover:bg-gray-500"
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
