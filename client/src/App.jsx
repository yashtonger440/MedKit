import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Auth from "./pages/Auth"
import Profile from "./pages/Profile";
import BookingHistory from "./pages/BookingHistory";
import Services from "./pages/Services";
import ScrollManager from "./components/ScrollManager";
import AmbulancePage from "./pages/AmbulancePage";
import DoctorBooking from "./pages/DoctorBooking";

function App() {
  return (
    <>
    <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />}/>
        <Route path="/booking" element={<Booking />}/>
        <Route path="/ambulance" element={<AmbulancePage />}/>
        <Route path="/bookadoctor" element={<DoctorBooking />}/>
        <Route path="/login" element={<Auth />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/bookinghistory" element={<BookingHistory />}/>
      </Routes>
    </>
  );
}

export default App;
