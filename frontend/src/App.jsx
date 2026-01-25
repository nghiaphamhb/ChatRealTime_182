import LandingPage from "./pages/landingPage/LandingPage";
import ChatPage from "./pages/chatPage/ChatPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}
