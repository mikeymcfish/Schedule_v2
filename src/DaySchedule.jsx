import React, { useEffect, useState } from "react";
import dates from "./dates-v2.json";
import colors from "./colors.json";

const DaySchedule = ({ date, customEvents }) => {
  const [timeLinePosition, setTimeLinePosition] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [letterDay, setLetterDay] = useState("");
  const [fullDate, setFullDate] = useState("");
  const [weekColor, setWeekColor] = useState("");
  const [isNoSchool, setIsNoSchool] = useState(false);
  const [blocksUS, setBlocksUS] = useState([
    { className: "advisory", color: "none" },
    { className: "p1", color: "blue" },
    { className: "break", color: "none" },
    { className: "p2", color: "red" },
    { className: "flex", color: "none" },
    { className: "break", color: "none" },
    { className: "p3", color: "green" },
    { className: "lunch", color: "none" },
    { className: "p4", color: "red" },
    { className: "break", color: "none" },
    { className: "p5", color: "orange" },
  ]);
  const [blocksMS, setBlocksMS] = useState([
    { className: "advisory", color: "none" },
    { className: "p1", color: "blue" },
    { className: "break", color: "none" },
    { className: "p2", color: "red" },
    { className: "break", color: "none" },
    { className: "flex", color: "none" },
    { className: "break", color: "none" },
    { className: "p3", color: "yellow" },
    { className: "lunch", color: "none" },
    { className: "break", color: "none" },
    { className: "p4", color: "orange" },
    { className: "break", color: "none" },
    { className: "p5", color: "blue" },
    { className: "break", color: "none" },
    { className: "p6", color: "tan" },
    { className: "sports", color: "none" },
  ]);

  const getColorFromCode = (code) => {
    const firstLetter = code.charAt(0).toLowerCase();
    switch (firstLetter) {
      case "v":
        return "purple";
      case "g":
        return "green";
      case "b":
        return "blue";
      case "r":
        return "red";
      case "y":
        return "yellow";
      case "o":
        return "orange";
      case "p":
        return "pink";
      case "t":
        return "tan";
      default:
        return "none";
    }
  };

  const getFullDate = (date) => {
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    return formattedDate;
  };

  const setScheduleBlocks = () => {
    const formattedDate = new Date(date + "T00:00:00")
      .toISOString()
      .split("T")[0];

    const todaySchedule = dates.DateScheduleWeek.find(
      (entry) => entry.date === formattedDate,
    );
    if (todaySchedule) {
      const todayDay = todaySchedule.day;
      setLetterDay(todayDay);
      setFullDate(getFullDate(new Date(todaySchedule.date + "T00:00:00")));
      setIsNoSchool(todaySchedule.note.toLowerCase() === "no school");
      // Only set the schedules if it's not a "no school" day
      if (!isNoSchool) {
        // Set US schedule
        const USschedule = colors.SchoolWeek.find(
          (day) =>
            day.Day === todayDay &&
            day.Type === "US" &&
            day.Color == todaySchedule.color,
        );

        if (USschedule) {
          setWeekColor(USschedule.Color);
          setBlocksUS((prevBlocks) =>
            prevBlocks.map((block) => {
              const entry = USschedule.Schedule.find(
                (scheduleEntry) => scheduleEntry.Period === block.className,
              );
              if (entry) {
                return {
                  ...block,
                  color: getColorFromCode(entry.Class),
                  letter: entry.Class.charAt(0),
                };
              }
              return block;
            }),
          );
        }
        // Set MS schedule
        const MSschedule = colors.SchoolWeek.find(
          (day) => day.Day === todayDay && day.Type === "MS",
        );
        if (MSschedule) {
          setBlocksMS((prevBlocks) =>
            prevBlocks.map((block) => {
              const entry = MSschedule.Schedule.find(
                (scheduleEntry) => scheduleEntry.Period === block.className,
              );
              if (entry) {
                return {
                  ...block,
                  color: getColorFromCode(entry.Class),
                  letter: entry.Class.charAt(0),
                };
              }
              return block;
            }),
          );
        }
      } else {
        setWeekColor("none");
        setBlocksUS((prevBlocks) =>
          prevBlocks.map((block) => ({ ...block, color: "none" })),
        );
        setBlocksMS((prevBlocks) =>
          prevBlocks.map((block) => ({ ...block, color: "none" })),
        );
      }
    }
  };

  useEffect(() => {
    setScheduleBlocks();
  }, [date]);

  useEffect(() => {
    const updateLinePosition = () => {
      const now = new Date();
      const start = new Date();
      start.setHours(8, 0, 0, 0); // Start time
      const end = new Date();
      end.setHours(15, 20, 0, 0); // End time

      if (now < start || now > end) {
        setTimeLinePosition(-1); // A value to hide the line
        setCurrentTime("");
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
      let ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      return `${hours}:${minutes} ${ampm}`;
    };

    updateLinePosition();
    const interval = setInterval(updateLinePosition, 60000);

    return () => clearInterval(interval);
  }, []);

  const [processedEvents, setProcessedEvents] = useState([]);
  useEffect(() => {
      console.log('Current date prop:', date);
      console.log('All custom events:', customEvents);

      if (Array.isArray(customEvents)) {
        const filteredEvents = customEvents.filter(event => event.date === date);
        console.log('Filtered events for this date:', filteredEvents);

        const processed = filteredEvents.map(event => ({
          ...event,
          style: calculateEventStyle(event)
        }));
        setProcessedEvents(processed);
      } else {
        console.warn('customEvents is not an array:', customEvents);
        setProcessedEvents([]);
      }
    }, [date, customEvents]);

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date(2000, 0, 1, hours, minutes);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const calculateEventStyle = (event) => {
    const startTime = new Date(`${date}T${event.startTime}`);
    const endTime = new Date(startTime.getTime() + event.duration * 60000);

    const dayStart = new Date(`${date}T08:00:00`);
    const dayEnd = new Date(`${date}T15:20:00`);
    const totalMinutes = (dayEnd - dayStart) / 60000;

    const startPercent = ((startTime - dayStart) / 60000) / totalMinutes * 100;
    const heightPercent = (event.duration / totalMinutes) * 100;

    return {
      top: `${startPercent}%`,
      height: `${heightPercent}%`,
      backgroundColor: event.color || '#cccccc',
      position: 'absolute',
      width: '100%',
      left: 0,
      overflow: 'hidden',
      padding: '2px',
      boxSizing: 'border-box',
      fontSize: '0.8em',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    };
  };

  return (
    <div className="container">
      {timeLinePosition >= 0 && (
        <div className="time-line" style={{ top: `${timeLinePosition}%` }}>
          <div className="time-display">{currentTime}</div>
        </div>
      )}
      <div className="UpperSchool">
        {!isNoSchool &&
          blocksUS.map((block, index) => (
            <div
              key={`${date}-us-${block.className}-${index}`}
              className={block.className}
              color-block={block.color}
            >
              <div
                className="letterDisplay"
                style={{
                  color:
                    block.letter === "Y" || block.letter === "P"
                      ? "black"
                      : "white",
                }}
              >
                {block.letter}
              </div>
            </div>
          ))}
      </div>
      {isNoSchool ? (
        <div id="title" className="Title gray-background">
          No School
        </div>
      ) : (
        <div
          id="title"
          className={`Title ${weekColor == "Navy" ? "navy-background" : "gold-background"}`}
        >
          <span className="letterDay">{letterDay}</span>
          <span className="fullDate">{fullDate}</span>
        </div>
      )}
      <div className="center-column">
        <div className="lines-container">
          {Array.from(Array(88).keys()).map((i) => (
            <div key={`${date}-line-${i}`} className="lines"></div>
          ))}
          {/* <div className="grid-lines"></div> */}
        </div>
        <div className="custom-events-container" style={{ 
          position: 'absolute', 
          top: 0,
          left: 0,
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none'
        }}>
          {
            processedEvents.map((event, index) => {
              const startTimeFormatted = formatTime(event.startTime);
              const endTime = new Date(new Date(`${date}T${event.startTime}`).getTime() + event.duration * 60000);
              const endTimeFormatted = formatTime(endTime.toTimeString().slice(0, 5));

              return (
                <div 
                  key={`${date}-event-${event.title}-${index}`} 
                  style={{
                    ...event.style,
                    zIndex: 10,
                    pointerEvents: 'auto'
                  }}
                >
                  <div>{event.title}</div>
                  <div>{startTimeFormatted} - {endTimeFormatted}</div>
                </div>
              );
            })
          }
        </div>
      </div>
      <div className="MiddleSchool">
        {!isNoSchool &&
          blocksMS.map((block, index) => (
            <div
              key={`${date}-ms-${block.className}-${index}`}
              className={block.className}
              color-block={block.color}
            >
              <div
                className="letterDisplay"
                style={{
                  color:
                    block.letter === "Y" || block.letter === "P"
                      ? "black"
                      : "white",
                }}
              >
                {block.letter}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

DaySchedule.defaultProps = {
  customEvents: [],
};

export default DaySchedule;
