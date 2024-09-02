import React from "react";
import DaySchedule from "./DaySchedule.jsx";
import "./App.css";

const App = () => {
  const datesToDisplay = [];
  const startDate = new Date('2024-09-02T00:00:00');
  // 195 is full
  for (let i = 0; datesToDisplay.length < 195; i++) {
    const tempDate = new Date(startDate);
    tempDate.setDate(startDate.getDate() + i);
    const day = tempDate.getDay();
    if (day !== 0 && day !== 6) { // skip saturday (6) and sunday (0)
      datesToDisplay.push(tempDate.toISOString().split('T')[0]);
    }
  }
  
  // Group dates into sets of 3
  const groupedDates = [];
  for (let i = 0; i < datesToDisplay.length; i += 3) {
    groupedDates.push(datesToDisplay.slice(i, i + 3));
  }

  return (
    <div className="app-container">
      {groupedDates.map((group, index) => (
        <div key={index} className="schedule-group">
          <div className="schedules">
            {group.map((date) => (
              <DaySchedule key={date} date={date} />
            ))}
          </div>
          <div className="notes-section">
            <div className="lines-container">
              {Array.from(Array(10).keys()).map((i) => (
                <div key={i} className="lines-notes"></div>
              ))}
               {/* <div className="grid-lines"></div> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;