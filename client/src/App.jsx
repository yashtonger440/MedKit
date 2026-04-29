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
import Partners from "./pages/Partners";
import PartnerForm from "./pages/PartnerForm";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AuthAdmin from "./pages/admin/AuthAdmin";
import AdminDoctors from "./pages/admin/AdminDoctors";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthDoctor from "./pages/doctor/AuthDoctor";
import AdminUsers from "./pages/admin/AdminUsers";

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
        <Route path="/partners" element={<Partners />}/>
        <Route path="/partnerform" element={<PartnerForm />}/>
        <Route path="/login" element={<Auth />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/bookinghistory" element={<BookingHistory />}/>

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />}/>
        <Route path="/admin-login" element={<AuthAdmin />}/>
        <Route path="/admin/doctors" element={<AdminDoctors />}/>
        <Route path="/admin/users" element={<AdminUsers />}/>

        {/* Doctor Dashboard */}
        <Route path="/doctor-login" element={<AuthDoctor />}/>

         {/* Protected Routes */}
        <Route path="/doctor-dashboard" element={<ProtectedRoute role="doctor"></ProtectedRoute>}/>
      </Routes>
    </>
  );
}

export default App;
