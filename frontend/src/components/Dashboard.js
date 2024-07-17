import React from 'react';
import { getAllTrainings, getTraining, getUserInfo } from '../api/api';

const Dashboard = () => {
  const [userInfo, setUserInfo] = React.useState({});
  const [trainings, setTrainings] = React.useState([]);
  const [selectedTraining, setSelectedTraining] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        console.log('userId:', userId);
        const userInfo = await getUserInfo(userId);
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

  return (
    <div className="dashboard">
      {error && <div className="error">{error}</div>}
      <div className="user-info">
        <h2>User Info</h2>
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
};

export default Dashboard;
