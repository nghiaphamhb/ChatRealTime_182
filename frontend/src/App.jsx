import LandingPage from "./pages/landingPage/LandingPage";
import ChatPage from "./pages/chatPage/ChatPage";
import AboutPage from "./pages/aboutPage/AboutPage";
import ServicesPage from "./pages/servicesPage/ServicesPage";
import ContactPage from "./pages/contactPage/ContactPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./security/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
