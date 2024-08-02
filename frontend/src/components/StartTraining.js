import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { getTraining, getAllTrainings } from "../api/api";
import playButton from "../img/play.png";
import pauseButton from "../img/pause.png";
import '../styles/StartTraining.css';

const StartTraining = () => {
  const [trainings, setTrainings] = useState([]);
  const [training, setTraining] = useState({});
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('token'));
        const data = await getAllTrainings(token);
        const trainingID = params.id;
        const training = await getTraining(trainingID, token);

        setTraining(training);
        setTrainings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTrainings();
  }, [params.id]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (time >= training.duration) {
      setIsComplete(true);
      pauseTimer();
      training.status = true;
      setTime(0);
    }
  }, [time, training]);

  const startTimer = () => {
    setIsComplete(false);
    setIsRunning(true);
  };

  const pauseTimer = () => setIsRunning(false);

  const calculateProgress = () => {
    const totalSeconds = training.duration || 60;
    return (time % totalSeconds) / totalSeconds * 360;
  };

  return (
    <>
        <body className='start-training-body'>
            <div className="circular-timer">
            {!isComplete ? (
                <>
                <div className="progress-circle">
                    <div className="circle">
                    <div className="mask full" style={{ transform: `rotate(${calculateProgress()}deg)` }}>
                        <div className="fill"></div>
                    </div>
                    <div className="mask half">
                        <div className="fill" style={{ transform: `rotate(${calculateProgress() >= 180 ? 180 : calculateProgress()}deg)` }}></div>
                        <div className="fill fix" style={{ transform: `rotate(${calculateProgress() >= 180 ? calculateProgress() - 180 : 0}deg)` }}></div>
                    </div>
                    <div className="inside-circle">
                        <div className='timer'>
                        {Math.floor(time / 60)}:{('0' + (time % 60)).slice(-2)}
                        </div>
                        <div className='start-training-type'>
                        {training.type}
                        </div>
                    </div>
                    </div>
                </div>
                <div className="controls">
                    <button onClick={startTimer} className='start-button'> 
                    <img src={playButton} alt="Play" width={80} height={80} className='st-but-img'/>
                    </button>
                    <button onClick={pauseTimer} className='pause-button'>
                        <img src={pauseButton} alt="Pause" width={60} height={60} className='st-but-img'/>
                    </button>
                </div>
                </>
            ) : (
                <div className="completion-message">
                <h1>Training Complete!</h1>
                <button onClick={() => navigate('/training')}>Back to Trainings</button>
                </div>
            )}
            </div>
        </body>
    </>
    
  );
};

export default StartTraining;
