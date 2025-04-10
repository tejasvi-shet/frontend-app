import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import HospitalSelection from './HospitalSelection';
import DoctorSelection from './DoctorSelection';
import NoteItCanvas from './NoteItCanvas';
import Fundraiser from "./Fundraiser";
import AboutUs from './AboutUs';
import PrivacyPolicy from './PrivacyPolicy';
import ContactUs from './ContactUs';
import Gallery from './components/Gallery';
import UploadComponent from "./components/UploadComponent";
import Dashboard from './Dashboard';  // Importing the Dashboard component
import Coloring from './Coloring';
import Chat from "./Chat";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/hospitals" element={<HospitalSelection />} />
        <Route path="/doctors/:hospitalId" element={<DoctorSelection />} />
        <Route path="/canvas/:doctorId" element={<NoteItCanvas />} />
        <Route path="/fundraiser" element={<Fundraiser />} />
        <Route path="/Fundraiser" element={<Fundraiser />} />
        <Route path="/dashboard" element={<Dashboard />} />  {/* Added Dashboard Route */}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/upload" element={<UploadComponent />} />
        <Route path="/coloring" element={<Coloring />} />
         <Route path="/chat" element={<Chat />} />

      </Routes>
    </Router>
  );
}

export default App;
