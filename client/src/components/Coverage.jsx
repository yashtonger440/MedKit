import { FaMapMarkerAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Coverage() {
  const { t } = useTranslation();

  const areaKeys = [
    "rampurRoad",
    "kaladhungiRoad",
    "nainitalRoad",
    "mukhani",
    "heeraNagar",
    "kusumkhera",
    "panchakki",
    "bareillyRoad",
    "transportNagar",
    "lamachaur",
    "kathgharia",
    "devalchaur",
    "chadail",
    "kathgodamMarket",
    "gaulaBarrage",
    "shishMahal",
    "ranibagh",
  ];

  return (
    <section className="py-25 bg-gray-50">

      <div className="max-w-5xl mx-auto text-center px-4">

        {/* SMALL TAG */}
        <p className="text-sm text-blue-500 font-semibold tracking-wider uppercase">
          {t("coverage.badge")}
        </p>

        {/* HEADING */}
        <h2 className="text-4xl font-bold text-gray-800 mt-2">
          {t("coverage.headingLine1")}{" "}
          {t("coverage.headingLine2") && (
            <span className="text-blue-500">{t("coverage.headingLine2")}</span>
          )}
        </h2>

        {/* SUBTEXT */}
        <p className="text-gray-500 mt-3">
          {t("coverage.subheading")}
        </p>

        {/* AREAS */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">

          {areaKeys.map((key, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200"
            >
              <FaMapMarkerAlt className="text-blue-500 text-sm" />
              <span className="text-gray-700 text-sm font-medium">
                {t(`coverage.areas.${key}`)}
              </span>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}