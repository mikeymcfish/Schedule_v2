import React, { useEffect, useState } from 'react';
import './App.css';
import dates from './dates.json'; // Import dates JSON
import colors from './colors.json'; // Import colors JSON

const App = () => {
  const [timeLinePosition, setTimeLinePosition] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [blocksUS, setBlocksUS] = useState([
    { className: 'advisory', color: 'none'},
    { className: 'p1', color: 'blue'}, // Initial data, will be replaced
    { className: 'break', color: 'none'},
    { className: 'p2', color: 'red'},
    { className: 'flex', color: 'none'},
    { className: 'break', color: 'none'},
    { className: 'p3', color: 'green'},
    { className: 'lunch', color: 'none'},
    { className: 'p4', color: 'red'},
    { className: 'break', color: 'none'},
    { className: 'p5', color: 'orange'}
  ]);
  const [blocksMS, setBlocksMS] = useState([
    { className: 'advisory', color: 'none'},
    { className: 'p1', color: 'blue'}, // Initial data, will be replaced
    { className: 'break', color: 'none'},
    { className: 'p2', color: 'red'},
    { className: 'break', color: 'none'},
    { className: 'flex', color: 'none'},
    { className: 'break', color: 'none'},
    { className: 'p3', color: 'yellow'},
    { className: 'lunch', color: 'none'},
    { className: 'break', color: 'none'},
    { className: 'p4', color: 'orange'},
    { className: 'break', color: 'none'},
    { className: 'p5', color: 'blue'},
    { className: 'break', color: 'none'},
    { className: 'p6', color: 'tan'},
    { className: 'sports', color: 'none'}
  ]);

  // Utility function to get today's date as a string
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Utility function to map class codes to color names
  const getColorFromCode = (code) => {
    const firstLetter = code.charAt(0).toLowerCase();
    switch(firstLetter) {
      case 'v': return 'purple';
      case 'g': return 'green';
      case 'b': return 'blue';
      case 'r': return 'red';
      case 'y': return 'yellow';
      case 'o': return 'orange';
      case 'p': return 'pink';
      case 't': return 'tan';
      default: return 'none';
    }
  };

  const setScheduleBlocks = () => {
    const todayDate = getTodayDate();
    const todaySchedule = dates.DateScheduleWeek.find(entry => entry.date === todayDate);
    if (todaySchedule) {
      const todayDay = todaySchedule.day;
      
      // Update US blocks
      const USschedule = colors.SchoolWeek.find(day => day.Day === todayDay && day.Type === "US");
      if (USschedule) {
        setBlocksUS(prevBlocks => 
          prevBlocks.map(block => {
            const entry = USschedule.Schedule.find(scheduleEntry => scheduleEntry.Period === block.className);
            if (entry) {
              return { ...block, color: getColorFromCode(entry.Class) };
            }
            return block;
          })
        );
      } else {
        console.log(`No US schedule found for day: ${todayDay}`);
      }
      
      // Update MS blocks
      const MSschedule = colors.SchoolWeek.find(day => day.Day === todayDay && day.Type === "MS");
      if (MSschedule) {
        setBlocksMS(prevBlocks => 
          prevBlocks.map(block => {
            const entry = MSschedule.Schedule.find(scheduleEntry => scheduleEntry.Period === block.className);
            if (entry) {
              return { ...block, color: getColorFromCode(entry.Class) };
            }
            return block;
          })
        );
      } else {
        console.log(`No MS schedule found for day: ${todayDay}`);
      }
    } else {
      console.log(`No schedule found for date: ${todayDate}`);
    }
  };

  useEffect(() => {
    setScheduleBlocks();
  }, []);

  useEffect(() => {
    const updateLinePosition = () => {
      const now = new Date();
      const start = new Date();
      start.setHours(8, 0, 0, 0); // Start time
      const end = new Date();
      end.setHours(15, 20, 0, 0); // End time

      if (now < start || now > end) {
        setTimeLinePosition(-1); // A value to hide the line
        setCurrentTime('');
        return;
      }

      const totalMinutes = (end - start) / (1000 * 60); // Total minutes in the range
      const passedMinutes = (now - start) / (1000 * 60); // Minutes since start time

      setTimeLinePosition((passedMinutes / totalMinutes) * 100);
      setCurrentTime(formatTime(now));
    };

    const formatTime = (date) => {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      return `${hours}:${minutes} ${ampm}`;
    };

    updateLinePosition();
    const interval = setInterval(updateLinePosition, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      {/* Time line indicator */}
      {timeLinePosition >= 0 && (
        <div
          className="time-line"
          style={{ top: `${timeLinePosition}%` }}
        >
          <div className="time-display">{currentTime}</div>
        </div>
      )}
      <div className="UpperSchool">
        {blocksUS.map((block, index) => (
          <div
            key={index}
            className={block.className}
            color-block={block.color}
          ></div>
        ))}
      </div>
      <div className="Title">day goes here</div>
      <div className="center-column">
      </div>
      <div className="MiddleSchool">
        {blocksMS.map((block, index) => (
          <div
            key={index}
            className={block.className}
            color-block={block.color}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default App;