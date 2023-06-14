import React, { useState, useEffect } from 'react';
import './App.css';
import Clock from './Clock';

function App() {
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [clockedIn, setClockedIn] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);
  const [clockOutTimes, setClockOutTimes] = useState([]);

  const handleClockIn = () => {
    if (!clockedIn) {
      setClockedIn(true);
      setStartTime(new Date().getTime() - pausedTime);
    }
  };

  const handlePause = () => {
    if (clockedIn && startTime) {
      setPausedTime(currentTime - startTime);
      setClockedIn(false);
    }
  };

  const handleResume = () => {
    if (!clockedIn && startTime) {
      setClockedIn(true);
      setStartTime(new Date().getTime() - pausedTime);
    }
  };

  const handleClockOut = () => {
    if (clockedIn && startTime) {
      const clockOutTime = new Date();
      const elapsedMilliseconds = clockOutTime.getTime() - startTime;
      const formattedTime = formatTime(elapsedMilliseconds);
      setClockOutTimes(prevTimes => [...prevTimes, formattedTime]);
      setStartTime(null);
      setClockedIn(false);
      setPausedTime(0);
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const elapsed = startTime ? currentTime - startTime : 0;

  useEffect(() => {
    let intervalId = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Time Clocker</h1>
        <Clock />
        {clockedIn ? (
          <div>
            <h2>{formatTime(elapsed)}</h2>
            <div>
              <button onClick={handlePause}>Pause</button>
              <button onClick={handleClockOut}>Clock Out</button>
            </div>
          </div>
        ) : (
          <>
            {clockOutTimes.length > 0 && (
              <div>
                <h3>Previous Clock Out Times:</h3>
                <ul>
                  {clockOutTimes.map((time, index) => (
                    <li key={index}>{time}</li>
                  ))}
                </ul>
              </div>
            )}
            <button onClick={handleClockIn}>Clock In</button>
          </>
        )}

        {!clockedIn && pausedTime > 0 && (
          <button onClick={handleResume}>Resume</button>
        )}
      </header>
    </div>
  );
}

export default App;
