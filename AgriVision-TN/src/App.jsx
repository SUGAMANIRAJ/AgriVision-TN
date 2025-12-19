import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import FarmerPortal from "./pages/FarmerPortal";
import BusinessPortal from "./pages/BusinessPortal";

export default function App() {
  // TEMP: later this comes from auth / token
  const userRole = "farmer"; // "business" | "guest"

  return (
    <>
      <Navbar role={userRole} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/farmer" element={<FarmerPortal />} />
        <Route path="/business" element={<BusinessPortal />} />
      </Routes>
    </>
  );
}
