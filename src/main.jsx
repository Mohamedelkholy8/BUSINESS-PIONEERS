import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import About from './about/About'
import Services from './services/Services'
import Projects from './Projects/Projects'

// Admin & Auth Imports 
import ProtectedRoute from './ProtectedRoute';
import AdminLogin from './AdminLogin'; 
import AdminLayout from './AdminLayout';
import ManageProjects from './ManageProjects';
import AdminDashboard from './AdminDashboard';
import ManageApplications from './ManageApplications';
import ManageOrders from './ManageOrders';
import ManageSettings from './ManageSettings';
import Portfolio from './Portfolio';
import Certifications from './Certifications';
import Careers from './Careers';
import Profile from './Profile';
import Contact from './Contact';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function Layout() {
  const location = useLocation();
  const overlayRef = useRef(null);

  useEffect(() => {
    // Page transition animation
    gsap.set(overlayRef.current, { y: "0%" }); // Reset overlay to cover screen
    gsap.to(overlayRef.current, {
      y: "-100%",
      duration: 1,
      ease: "power4.inOut"
    });
  }, [location.pathname]);

  return (
    <>
      <div 
        id="transition-overlay" 
        ref={overlayRef}
        className="fixed top-0 left-0 w-full h-screen bg-black z-[9999] pointer-events-none"
      ></div>
      
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Admin Login - Keep it separate from protected routes */}
          {/* Admin Login - Commented out until component exists */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected Admin Section */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="orders" element={<ManageOrders />} />
              <Route path="applications" element={<ManageApplications />} />
              <Route path="leads" element={<div>Manage Leads Page</div>} />
              <Route path="settings" element={<ManageSettings />} />
            </Route>
          </Route>

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
)