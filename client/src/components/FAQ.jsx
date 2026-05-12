import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
  {
    question: "How do I book a doctor on MedKit?",
    answer:
      "Booking a doctor on MedKit is simple! Just login to your account, go to the 'Book a Doctor' section, select your required service (e.g. Cardiology, Dermatology), choose a doctor, fill in your details, and confirm your booking. You can choose between Audio Call, Video Call, or Home Visit as per your preference.",
    // icon: "🩺",
  },
  {
    question: "Can I consult a doctor via video or audio call?",
    answer:
      "Yes! MedKit supports both Audio Call and Video Call consultations. Once your booking is accepted by the doctor, they will initiate the call at the scheduled time. Make sure your microphone and camera permissions are enabled in your browser for a smooth experience.",
    // icon: "📞",
  },
  {
    question: "Is my medical information safe on MedKit?",
    answer:
      "Absolutely. MedKit takes your privacy very seriously. All your personal and medical data is securely stored and encrypted. We never share your information with third parties without your consent. Your consultation history is only visible to you and your assigned doctor.",
    // icon: "🔒",
  },
  {
    question: "What if the doctor is not available at the scheduled time?",
    answer:
      "If a doctor is unavailable, your booking status will be updated and you will be notified. You can then rebook with the same doctor or choose another available doctor from the same specialization. Our support team is also available to help you reschedule.",
    // icon: "📅",
  },
  {
    question: "How do I request a Home Visit?",
    answer:
      "During the booking process, simply select 'Home Visit' as your consultation type. Make sure to provide your correct address and phone number. The doctor will review your request and visit you at the scheduled time. Home visits are available for select specializations.",
    // icon: "🏠",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-3xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          {/* <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full mb-4">
            Got Questions?
          </span> */}
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-base">
            Everything you need to know about MedKit. Can't find the answer? Feel free to contact us.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden
                  ${isOpen
                    ? "border-blue-300 shadow-lg shadow-blue-100 bg-white"
                    : "border-gray-200 bg-white hover:border-blue-200 hover:shadow-md"
                  }`}
              >
                {/* Question Row */}
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{faq.icon}</span>
                    <span className={`font-semibold text-base transition-colors duration-200
                      ${isOpen ? "text-blue-600" : "text-gray-800"}`}
                    >
                      {faq.question}
                    </span>
                  </div>

                  {/* Arrow Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300
                    ${isOpen ? "bg-blue-500 rotate-180" : "bg-gray-100"}`}
                  >
                    <FaChevronDown
                      size={12}
                      className={isOpen ? "text-white" : "text-gray-500"}
                    />
                  </div>
                </button>

                {/* Answer — smooth open/close */}
                <div className={`transition-all duration-700 ease-in-out
                  ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="px-6 pb-6">
                    {/* Divider */}
                    <div className="h-px bg-blue-100 mb-4" />
                    <p className="text-gray-600 text-sm leading-relaxed pl-9">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        {/* <div className="mt-10 text-center p-8 rounded-3xl shadow-xl">
          <p className="text-black text-lg font-semibold mb-1">Still have questions?</p>
          <p className="text-gray-800 text-sm mb-5">
            Our support team is here to help you 24/7
          </p>
          <a
            href="mailto:support@medkit.com"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200"
          >
            📧 Contact Support
          </a>
        </div> */}

      </div>
    </section>
  );
};

export default FAQ;