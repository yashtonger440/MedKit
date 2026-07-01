import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const faqKeys = ["q1", "q2", "q3", "q4", "q5"];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useTranslation();

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-3xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            {t("faq.heading")}
          </h2>
          <p className="text-gray-500 text-base">
            {t("faq.subheading")}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqKeys.map((key, index) => {
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
                    <span className={`font-semibold text-base transition-colors duration-200
                      ${isOpen ? "text-blue-600" : "text-gray-800"}`}
                    >
                      {t(`faq.${key}.question`)}
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
                      {t(`faq.${key}.answer`)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;