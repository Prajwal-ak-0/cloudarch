import { Routes, Route } from "react-router-dom";
import Home from "@/components/home";
import Generate from "@/components/genrate";

function App() {
  return (
    <div className="w-screen min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<Generate />} />
      </Routes>
    </div>
  );
}

export default App;