import React from "react";
import CalendarApp from "./components/CalendarApp";
import "./components/CalendarApp.css";
import "./index.css";
import Statistics from "./components/Statistics";
import {Routes, Route} from "react-router-dom"



const App = () => {
  return (
    <div className="container">
      <Routes>
      <Route path="/" element={<CalendarApp/>}/>
      <Route path="/statistics" element={<Statistics/>}/>
      </Routes>
      
    </div>
  );
};

export default App;
