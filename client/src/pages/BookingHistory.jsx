import { useEffect, useState } from "react";
import API from "../services/api";

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await API.get("/bookings/my");
                setBookings(res.data);
            } catch (err) {
                console.log("error object", err);
                console.log("BACKEND ERROR:", err.response?.data);
            } finally {
                setLoading(false);
            }
        }
        fetchBookings();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <p className="text-lg">Loading Bookings...</p>
            </div>
        );
    }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-20">
      
      <h1 className="text-3xl font-bold text-center mb-10">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">
          No bookings found
        </p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          
          {bookings.map((b, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-xl p-5 flex justify-between items-center"
            >
              
              {/* Left */}
              <div>
                <h2 className="text-xl font-semibold">
                  {b.service}
                </h2>
                <p className="text-gray-500 text-sm">
                  {new Date(b.date).toLocaleString()}
                </p>
              </div>

              {/* Right */}
              <div className="text-right">
                <p className="font-bold text-blue-600">
                  ₹{b.price}
                </p>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    b.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : b.status === "cancelled"
                      ? "bg-red-100 text-red-500"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {b.status}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;