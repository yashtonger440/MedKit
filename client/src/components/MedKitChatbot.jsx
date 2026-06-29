import { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

const SYSTEM_PROMPT = `You are MedKit AI Assistant — a helpful healthcare chatbot for MedKit, a home healthcare platform in Dehradun, India.

About MedKit:
- Home healthcare services: Injection at Home, IV Drip, ECG, Physiotherapy, BP & Sugar Check, Blood Test, Nurse Visit, Dressing, Plaster
- Doctor consultations: Audio Call, Video Call, Home Visit
- Service available in Dehradun and nearby areas
- Technicians visit your home within scheduled time
- Pay after service — no upfront payment

You can help with:
1. MedKit services, pricing, and booking guidance
2. General health questions and medical information
3. Suggest which MedKit service a user might need

Always be helpful, empathetic, and professional. Keep responses concise and clear.
If someone has an emergency, always advise them to call 112 or visit nearest hospital immediately.
Reply in the same language the user writes in (Hindi or English).`;

const MedKitChatbot = () => {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Namaste! 👋 Main MedKit AI Assistant hoon. Aapki koi bhi health ya booking related problem mein help kar sakta hoon. Kya poochna chahte hain?",
    },
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
  if (!input.trim() || loading) return;

  const userMessage = { role: "user", content: input.trim() };
  const updatedMessages = [...messages, userMessage];

  setMessages(updatedMessages);
  setInput("");
  setLoading(true);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/chatbot/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      }
    );

    const data = await response.json();
    setMessages(prev => [
      ...prev,
      { role: "assistant", content: data.reply || "Sorry, kuch problem aayi." },
    ]);
  } catch (err) {
    setMessages(prev => [
      ...prev,
      { role: "assistant", content: "Sorry, abhi service unavailable hai." },
    ]);
  } finally {
    setLoading(false);
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <>
      {/* ── Chat Popup ── */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[10000] w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ height: "500px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <FaRobot size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">MedKit AI Assistant</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                  <p className="text-xs text-white/80">Online</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
            >
              <FaTimes size={14} className="text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1">
                    <FaRobot size={12} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-br-sm"
                      : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1">
                  <FaRobot size={12} className="text-white" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Services kya hain?",
                  "Booking kaise karein?",
                  "Injection price?",
                  "Doctor available?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                    className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition border border-blue-100"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Apna sawal likho..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center transition disabled:opacity-40 shrink-0"
              >
                <FaPaperPlane size={12} className="text-white" />
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-1.5">
              Powered by MedKit AI
            </p>
          </div>
        </div>
      )}

      {/* ── Floating Button ── */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-2xl flex items-center justify-center transition hover:scale-110"
      >
        {open ? (
          <FaTimes size={20} className="text-white" />
        ) : (
          <FaRobot size={22} className="text-white" />
        )}
        {/* Notification dot */}
        {!open && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">1</span>
          </div>
        )}
      </button>
    </>
  );
};

export default MedKitChatbot;