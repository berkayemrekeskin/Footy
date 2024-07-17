import React from 'react';
import { getAllTrainings, getTraining, getUserInfo } from '../api/api';

const Dashboard = () => {
  const [userInfo, setUserInfo] = React.useState({});
  const [trainings, setTrainings] = React.useState([]);
  const [selectedTraining, setSelectedTraining] = React.useState(null);
  const [error, setError] = React.useState(null);
  
  const [name, setName] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [email, setEmail] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('userId'));
        console.log('userId:', userId);
        const infoId = JSON.parse(localStorage.getItem('infoId'));
        console.log('infoId:', infoId);
        const token = JSON.parse(localStorage.getItem('token'));
        console.log('token:', token);
        const userInfo = await getUserInfo(infoId, token);
        
        setName(JSON.parse(localStorage.getItem('name')));
        setSurname(JSON.parse(localStorage.getItem('surname')));
        setEmail(JSON.parse(localStorage.getItem('email')));

        console.log('userInfo:', userInfo);
        const trainings = await getAllTrainings();
        setTrainings(trainings);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred while fetching data.");
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('userId'));
        console.log('userId:', userId);
        const infoId = JSON.parse(localStorage.getItem('infoId'));
        console.log('infoId:', infoId);
        const token = JSON.parse(localStorage.getItem('token'));
        console.log('token:', token);
        const userInfo = await getUserInfo(infoId, token);

        setUserInfo(userInfo);
        console.log('userInfo:', userInfo);
        const trainings = await getAllTrainings();
        setTrainings(trainings);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred while fetching data.");
      }
    };
    fetchData();
  }, []);

  const handleTrainingSelect = async (id) => {
    try {
      const training = await getTraining(id);
      setSelectedTraining(training);
    } catch (error) {
      console.error("Error fetching training:", error);
      setError(error.message || "An error occurred while fetching training.");
    }
  };


  if(userInfo.position === 'Goalkeeper') {
    return (
      <div className="dashboard">
        {error && <div className="error">{error}</div>}
        <div className="user-info">
          <h2>User Info</h2>
          <p>Name: {name}</p>
          <p>Surname: {surname}</p>
          <p>Email: {email}</p>
          <p>Position: {userInfo.position}</p>
          <p>Saves: {userInfo.saves}</p>
          <p>Goals Conceded: {userInfo.goals_conceded}</p>
          <p>Passes Tried: {userInfo.passes_tried}</p>
          <p>Passes Complete: {userInfo.passes_complete}</p>
        </div>
        <div className="trainings">
          <h2>Trainings</h2>
          <ul>
            {trainings.map((training) => (
              <li key={training._id} onClick={() => handleTrainingSelect(training._id)}>
                {training.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="selected-training">
          <h2>Selected Training</h2>
          {selectedTraining && (
            <div>
              <p>Name: {selectedTraining.name}</p>
              <p>Description: {selectedTraining.description}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
  else {
    return (
      <div className="dashboard">
        {error && <div className="error">{error}</div>}
        <div className="user-info">
          <h2>User Info</h2>
          <p>Name: {name}</p>
          <p>Surname: {surname}</p>
          <p>Email: {email}</p>
          <p>Position: {userInfo.position}</p>
          <p>Goals: {userInfo.goals}</p>
          <p>Assists: {userInfo.assists}</p>
          <p>Passes Tried: {userInfo.passes_tried}</p>
          <p>Passes Complete: {userInfo.passes_complete}</p>
          <p>Dribbles Tried: {userInfo.dribbles_tried}</p>
          <p>Dribbles Complete: {userInfo.dribbles_complete}</p>
          <p>Shots Tried: {userInfo.shots_tried}</p>
          <p>Shots Complete: {userInfo.shots_complete}</p>
        </div>
        <div className="trainings">
          <h2>Trainings</h2>
          <ul>
            {trainings.map((training) => (
              <li key={training._id} onClick={() => handleTrainingSelect(training._id)}>
                {training.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="selected-training">
          <h2>Selected Training</h2>
          {selectedTraining && (
            <div>
              <p>Name: {selectedTraining.name}</p>
              <p>Description: {selectedTraining.description}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default Dashboard;
