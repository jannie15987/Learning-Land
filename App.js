// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReadingLanding from "./pages/reading/ReadingLanding";
import Level1AlphabetGame from "./pages/reading/Level1AlphabetGame";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/reading" element={<ReadingLanding />} />
        <Route path="/reading/level1" element={<Level1AlphabetGame />} />
        {/* Add more levels/routes here */}
      </Routes>
    </Router>
  );
}

export default App;
