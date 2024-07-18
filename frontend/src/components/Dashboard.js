import React from 'react';
import { getAllTrainings, getTraining, getUserInfo } from '../api/api';
import { useNavigate } from 'react-router-dom';
import "../styles/Dashboard.css";

const Dashboard = () => {

  const [userInfo, setUserInfo] = React.useState({});
  const [trainings, setTrainings] = React.useState([]);
  const [selectedTraining, setSelectedTraining] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [name, setName] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('userId'));
        const infoId = JSON.parse(localStorage.getItem('infoId'));
        const token = JSON.parse(localStorage.getItem('token'));
        const userInfo = await getUserInfo(infoId, token);
        const trainings = await getAllTrainings(token);

        setName(JSON.parse(localStorage.getItem('name')));
        setSurname(JSON.parse(localStorage.getItem('surname')));
        setEmail(JSON.parse(localStorage.getItem('email')));
        setUserInfo(userInfo);
        setTrainings(trainings);

        console.log('userId:', userId);
        console.log('infoId:', infoId);
        console.log('token:', token);
        console.log('userInfo:', userInfo);
        console.log('trainings:', trainings);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred while fetching data.");
      }
    };
    fetchData();
  }, []);

  const handleTrainingSelect = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const training = await getTraining(id, token);
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
        <button onClick={() => navigate("/training/create")}>Create Training</button>
      </div>
    );
  }
  else {
    return (
      <div className="dashboard">
        <div className="left-container"> 
          <div className='leftBar'>
            <div className='buttonContainer'>
              <button className="button" onClick={() => navigate('/dashboard')}>Dashboard</button>
              <button className="button" onClick={() => navigate('/training')}>Training</button>
              <button className="button" onClick={() => navigate('/progress')}>Progress</button>
              <button className="button" onClick={() => navigate('/profile')}>Profile</button>
            </div>
          </div>
        </div>
        <div className='right-container'>
          <div className='upperBar'>
            <div className='logo'>
            </div>
          </div>
          <div className='inner-container'>
            <div className='inner-first'>
              <div className="user-info">
                <div className='user-info-card'>
                  Hello User
                </div>
              </div>
              <div className='personal-info'>
                <div className='personal-info-card'>
                  PERSONAL1
                </div>
                <div className='personal-info-card'>
                  PERSONAL2
                </div>
              </div>
            </div>
            <div className='inner-second'>
              <div className='training-info'>
                <div className='training-card'>
                  CARD
                </div>
                <div className='training-card'>
                  CARD
                </div>
                <div className='training-card'>
                  CARD
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    );
  }
};

export default Dashboard;
