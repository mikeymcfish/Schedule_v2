import React from "react";
import DaySchedule from "./DaySchedule.jsx";
import "./App.css";

const App = () => {
  const datesToDisplay = [];
  const startDate = new Date('2024-09-02T00:00:00');
  // 195 is full
  for (let i = 0; datesToDisplay.length < 9; i++) {
    const tempDate = new Date(startDate);
    tempDate.setDate(startDate.getDate() + i);
    const day = tempDate.getDay();
    if (day !== 0 && day !== 6) { // skip saturday (6) and sunday (0)
      datesToDisplay.push(tempDate.toISOString().split('T')[0]);
    }
  }
  return (
    <div className="app-container">
      {datesToDisplay.map((date) => (
        <DaySchedule key={date} date={date} />
      ))}
    </div>
  );
};

export default App;
