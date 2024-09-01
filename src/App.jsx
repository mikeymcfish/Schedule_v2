import React from "react";
import DaySchedule from "./DaySchedule.jsx";
import "./App.css";

const App = () => {
  // You can define an array of dates you want to display
  const datesToDisplay = [];
  const date = new Date();
  for (let i = 0; datesToDisplay.length < 9; i++) {
    const tempDate = new Date(date);
    tempDate.setDate(date.getDate() + i);
    const day = tempDate.getDay();
    if (day !== 0 && day !== 1) {
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
