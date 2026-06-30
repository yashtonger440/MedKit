import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCompass, FaTimes, FaArrowLeft, FaCheckCircle, FaHome, FaVideo } from "react-icons/fa";

const RELATIONS = ["Self", "Parent", "Child", "Other family member"];

const CONCERNS = [
  { label: " Fever / Cold",        value: "fever" },
  { label: " Injury / Wound",      value: "injury" },
  { label: " Regular Checkup",     value: "checkup" },
  { label: " Need an Injection",   value: "injection" },
  { label: " Need a Blood Test",   value: "bloodtest" },
  { label: " Elderly Care",        value: "elderly" },
];

const RECOMMENDATIONS = {
  fever: {
    title: "Doctor Consultation",
    desc: "Fever/cold ke liye doctor se consult karna best rehta hai. Aap ghar pe home visit ya video call dono choose kar sakte hain.",
    dual: true, // 2 buttons dikhao
    homeAction: { label: " Book Home Visit", path: "/bookadoctor", service: "General Medicine - Home Visit" },
    onlineAction: { label: " Book Video Call or Voice call", path: "/bookadoctor", service: "General Medicine - Video/Voice Call" },
  },
  injury: {
    title: "Dressing / Wound Care",
    desc: "Choti injury ya wound ke liye ghar pe dressing service best hai. Certified technician aapke ghar aakar professionally dressing karenge.",
    action: { label: "Book Dressing Service", path: "/booking", service: "Minor Dressing" },
  },
  checkup: {
    title: "BP & Sugar Checkup",
    desc: "Regular health monitoring ke liye ghar pe checkup best option hai. Technician BP, sugar aur basic vitals check kar denge.",
    action: { label: "Book Checkup", path: "/booking", service: "BP & Sugar Check" },
  },
  injection: {
    title: "Injection at Home",
    desc: "Ghar pe injection lena safe aur convenient hai. Certified nurse aapke ghar aakar injection denge.",
    action: { label: "Book Injection Service", path: "/booking", service: "Injection at Home" },
  },
  bloodtest: {
    title: "Blood Test at Home",
    desc: "Sample collection ghar se hi ho sakti hai. Technician aake sample lenge aur report online mil jayegi.",
    action: { label: "Book Blood Test", path: "/booking", service: "Blood Test at Home" },
  },
  elderly: {
    title: "Elderly Care Plan",
    desc: "Elderly ke liye regular nursing support, checkups aur medication management — sab ghar pe. Hamare elderly care plans dekhein.",
    action: { label: "View Elderly Care Plans", path: "/elderlycare", service: null },
  },
};

const CareNavigator = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ relation: "", concern: "" });

  const resetAndClose = () => {
    onClose();
    setStep(0);
    setAnswers({ relation: "", concern: "" });
  };

  const selectAndNext = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    setTimeout(() => setStep((s) => s + 1), 200);
  };

  const recommendation = step === 2 ? RECOMMENDATIONS[answers.concern] : null;

  const handleBook = (path, service) => {
    resetAndClose();
    navigate(path, service ? { state: { service } } : {});
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                  <FaCompass size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">MedKit Care Navigator</p>
                  <p className="text-xs text-white/80">Find the right service in seconds</p>
                </div>
              </div>
              <button
                onClick={resetAndClose}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
              >
                <FaTimes size={13} className="text-white" />
              </button>
            </div>

            {/* Progress bar — sirf steps 0 aur 1 pe */}
            {step < 2 && (
              <div className="px-6 pt-4">
                <div className="flex gap-1.5">
                  {[0, 1].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        i <= step ? "bg-blue-500" : "bg-gray-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Body */}
            <div className="p-6 min-h-[280px] flex flex-col">

              {/* Step 0 — Who needs care */}
              {step === 0 && (
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Who needs care?</h3>
                  <p className="text-sm text-gray-500 mb-5">Select who this service is for</p>
                  <div className="grid grid-cols-2 gap-3">
                    {RELATIONS.map((r) => (
                      <button
                        key={r}
                        onClick={() => selectAndNext("relation", r)}
                        className={`p-4 rounded-2xl border text-sm font-medium transition-all text-left ${
                          answers.relation === r
                            ? "border-blue-400 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-700"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1 — Concern */}
              {step === 1 && (
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">What's the concern?</h3>
                  <p className="text-sm text-gray-500 mb-4">Choose the closest match</p>
                  <div className="grid grid-cols-1 gap-2">
                    {CONCERNS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => selectAndNext("concern", c.value)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${
                          answers.concern === c.value
                            ? "border-blue-400 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-700"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 — Result */}
              {step === 2 && recommendation && (
                <div className="flex-1 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <FaCheckCircle className="text-green-500 text-2xl" />
                  </div>

                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Best service for you
                  </p>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {recommendation.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    {recommendation.desc}
                  </p>

                  {/* Fever — 2 buttons */}
                  {recommendation.dual ? (
                    <div className="w-full flex flex-col gap-2">
                      <button
                        onClick={() => handleBook(
                          recommendation.homeAction.path,
                          recommendation.homeAction.service
                        )}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold transition shadow-md hover:scale-[1.02]"
                      >
                        {recommendation.homeAction.label}
                      </button>
                      <button
                        onClick={() => handleBook(
                          recommendation.onlineAction.path,
                          recommendation.onlineAction.service
                        )}
                        className="w-full py-3.5 border-2 border-blue-400 text-blue-600 rounded-xl font-semibold transition hover:bg-blue-50"
                      >
                        {recommendation.onlineAction.label}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBook(
                        recommendation.action.path,
                        recommendation.action.service
                      )}
                      className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold transition shadow-md hover:scale-[1.02]"
                    >
                      {recommendation.action.label}
                    </button>
                  )}

                  {/* Restart option */}
                  <button
                    onClick={() => {
                      setStep(0);
                      setAnswers({ relation: "", concern: "" });
                    }}
                    className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition"
                  >
                     Not what you needed? Start again
                  </button>
                </div>
              )}
            </div>

            {/* Back button */}
            {step === 1 && (
              <div className="px-6 pb-5">
                <button
                  onClick={() => setStep(0)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition"
                >
                  <FaArrowLeft size={11} /> Back
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CareNavigator;