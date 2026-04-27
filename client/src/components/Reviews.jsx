import { useEffect, useRef } from "react";

export default function Reviews() {
  const sliderRef = useRef();

  const reviews = [
    {
      name: "Rahul Sharma",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      text: "Amazing service! Doctor arrived within 20 minutes. Highly recommended.",
    },
    {
      name: "Neha Verma",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      text: "Very professional nurses. My parents feel safe and cared for.",
    },
    {
      name: "Amit Singh",
      img: "https://randomuser.me/api/portraits/men/12.jpg",
      rating: 4,
      text: "Quick booking and transparent pricing. Great experience overall.",
    },
    {
      name: "Priya Mehta",
      img: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 5,
      text: "Booked ambulance in emergency, reached very fast!",
    },
    {
      name: "Karan Patel",
      img: "https://randomuser.me/api/portraits/men/50.jpg",
      rating: 4,
      text: "Smooth booking process and polite staff.",
    },
    {
      name: "Sneha Kapoor",
      img: "https://randomuser.me/api/portraits/women/22.jpg",
      rating: 5,
      text: "Loved the service quality. Will use again.",
    },
    {
      name: "Rohit Gupta",
      img: "https://randomuser.me/api/portraits/men/77.jpg",
      rating: 5,
      text: "Best healthcare service at home!",
    },
    {
      name: "Anjali Sharma",
      img: "https://randomuser.me/api/portraits/women/30.jpg",
      rating: 4,
      text: "Affordable and quick response.",
    },
  ];

  // AUTO SCROLL EFFECT
  useEffect(() => {
    const slider = sliderRef.current;
    let scrollAmount = 0;

    const autoSlide = () => {
      if (slider) {
        scrollAmount += 1;
        slider.scrollLeft = scrollAmount;

        if (scrollAmount >= slider.scrollWidth / 2) {
          scrollAmount = 0;
        }
      }
    };

    const interval = setInterval(autoSlide, 20); // smooth speed

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-linear-to-br from-blue-50 to-cyan-100 overflow-hidden">

      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800">
          Client Reviews
        </h2>
        <p className="text-gray-600 mt-2">
          Real experiences from our happy users
        </p>
      </div>

      {/* SLIDER */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-hidden px-6"
      >
        {[...reviews, ...reviews].map((review, i) => (
          <div
            key={i}
            className="min-w-75 bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition duration-300"
          >
            {/* User */}
            <div className="flex items-center gap-3">
              <img
                src={review.img}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-800">
                  {review.name}
                </h4>
                <div className="text-yellow-400 text-sm">
                  {"★".repeat(review.rating)}
                </div>
              </div>
            </div>

            {/* Review */}
            <p className="text-gray-600 text-sm mt-4">
              {review.text}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}