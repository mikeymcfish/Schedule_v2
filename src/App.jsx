import React from "react";
import DaySchedule from "./DaySchedule.jsx";
import "./App.css";
import customEvents from './customEvents.json';  // Import your custom events JSON


const App = () => {
  // Function to get today and next 5 weekdays
  const getTodayAndNext5Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; dates.length < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  // Original date generation logic for print view
  const datesToDisplay = [];
  const startDate = new Date('2024-09-02T00:00:00');
  // 195 total
  for (let i = 0; datesToDisplay.length < 9; i++) {
    const tempDate = new Date(startDate);
    tempDate.setDate(startDate.getDate() + i);
    const day = tempDate.getDay();
    if (day !== 0 && day !== 6) { // skip saturday (6) and sunday (0)
      datesToDisplay.push(tempDate.toISOString().split('T')[0]);
    }
  }
  
  // Group dates into sets of 3 for print view
  const groupedDates = [];
  for (let i = 0; i < datesToDisplay.length; i += 3) {
    groupedDates.push(datesToDisplay.slice(i, i + 3));
  }

  const screenViewDates = getTodayAndNext5Days();

  return (
    <div className="app-container">
      {/* Screen view */}
      <div className="schedule-group screen-view">
        {screenViewDates.map((date) => (
          <DaySchedule key={`schedule-${date}`} date={date} customEvents={customEvents} />
        ))}
      </div>

      {/* Print view */}
      <div className="print-view">
        {groupedDates.map((group, index) => (
          <div key={index} className="schedule-group">
            <div className="schedules">
              {group.map((date) => (
                <DaySchedule key={`schedule-${date}`} date={date} customEvents={customEvents} />
              ))}
            </div>
            <div className="notes-section">
              <div className="lines-container">
                {Array.from(Array(10).keys()).map((i) => (
                  <div key={i} className="lines-notes"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;