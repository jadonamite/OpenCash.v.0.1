import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SwapPage from "./pages/SwapPage";
function App() {
   return (
      <Routes>
         <Route path="/" element={<LandingPage />} />
         <Route path="/app" element={<SwapPage />} />
      </Routes>
   );
}

export default App;
