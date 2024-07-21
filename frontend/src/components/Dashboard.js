import React from 'react';
import { getAllTrainings, getTraining, getUserInfo, updateTraining, deleteTraining} from '../api/api';
import { useNavigate } from 'react-router-dom';
import "../styles/Dashboard.css";
import { Circle } from 'rc-progress';
import physicalImg from '../img/physical.png';
import tacticalImg from '../img/tactical.png';
import technicalImg from '../img/technical.png';


const Dashboard = () => {

  const [userInfo, setUserInfo] = React.useState({});
  const [trainings, setTrainings] = React.useState([]);
  const [selectedTraining, setSelectedTraining] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [name, setName] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [date, setDate] = React.useState('');
  const [trainingStatistic, setTrainingStatistic] = React.useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('userId'));
        const infoId = JSON.parse(localStorage.getItem(`infoID${userId}`));
        const token = JSON.parse(localStorage.getItem('token'));
        const userInfo = await getUserInfo(infoId, token);
        const trainings = await getAllTrainings(token);
        let currentDate = new Date();
        currentDate = currentDate.toISOString().slice(0, 10);
        currentDate = currentDate.split('-').reverse().join('/');
        setDate(currentDate);
        setName(JSON.parse(localStorage.getItem('name')));
        setSurname(JSON.parse(localStorage.getItem('surname')));
        setUserInfo(userInfo);
        setTrainings(trainings);

        console.log('userId:', userId);
        console.log('infoId:', infoId);
        console.log('token:', token);
        console.log('userInfo:', userInfo);
        console.log('trainings:', trainings);

        let count = 0;

        for(let i = 0; i < trainings.length; i++)
        {
          if(trainings[i].status === true)
          {
            count++;
          }
        }

        setTrainingStatistic(count / trainings.length * 100);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred while fetching data.");
      }
    };
    fetchData();
  }, []);

  const whatToFocus = () => {
    if(userInfo.position === 'Goalkeeper')
    {
      if(userInfo.goals_conceded / userInfo.saves * 100 > 50)
        return 'Focus on your saves';
      else if(userInfo.passes_complete / userInfo.passes_tried * 100 < 50)
        return 'Focus on your passes';
      else
        return 'You are doing great';
    }
    else
    {
      if(userInfo.shots_complete / userInfo.shots_tried * 100 < 50)
        return 'Focus on your shots';
      else if(userInfo.passes_complete / userInfo.passes_tried * 100 < 50)
        return 'Focus on your passes';
      else if(userInfo.dribbles_complete / userInfo.dribbles_tried * 100 < 50)
        return 'Focus on your dribbles';
      else 
        return 'You are doing great';
    }
  }

  const handleStatusUpdate = async (trainingId) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await updateTraining(trainingId, { status: true }, token);
      console.log('Training status updated:', response);
      // Update the trainings state to mark the training as completed
      setTrainings((prevTrainings) => prevTrainings.map(training =>
        training._id === trainingId ? { ...training, status: true } : training
      ));
      setTrainingStatistic(prevStat => prevStat + (100 / trainings.length));
    } catch (error) {
      console.error('Error updating training status:', error);
    }
  };

  const handleRemoveTraining = async (trainingId) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await deleteTraining(trainingId, token);
      console.log('Training removed:', response);
      // Update the trainings state to remove the training
      setTrainings((prevTrainings) => prevTrainings.filter(training => training._id !== trainingId));
    } catch (error) {
      console.error('Error removing training:', error);
    }
  };


  function renderStatistics() {
    if(userInfo.position === 'Goalkeeper') {
      return (
        <div className='statistic-container'>
          <div className='statistic'>
            <Circle
              percent={userInfo.goals_conceded / userInfo.saves * 100} 
              strokeColor="#1c1f23"
              strokeWidth={6}
              trailWidth={6}
            />
            <div>Saves</div>
          </div>
          <div className='statistic'>
            <Circle
              percent={userInfo.passes_complete / userInfo.passes_tried * 100} 
              strokeColor="#1c1f23"
              strokeWidth={6}
              trailWidth={6}
            />
            <div>Passes</div>
          </div>
        </div>
      );
    }
    else 
    {
        return (
          <div className='statistic-container'>
            <div className='statistic'>
              <Circle
                percent={userInfo.shots_complete / userInfo.shots_tried * 100} 
                strokeColor="#1c1f23"
                strokeWidth={6}
                trailWidth={6}
              />
              <div>Shots</div>
            </div>
            <div className='statistic'>
              <Circle
                percent={userInfo.passes_complete / userInfo.passes_tried * 100} 
                strokeColor="#1c1f23"
                strokeWidth={6}
                trailWidth={6}
              />
              <div>Passes</div>
            </div>
              <div className='statistic'>
                <Circle
                  percent={userInfo.dribbles_complete / userInfo.dribbles_tried * 100} 
                  strokeColor="#1c1f23"
                  strokeWidth={6}
                  trailWidth={6}
                />
              <div>Dribbles</div>
            </div>
          </div>
        );
    }
  }

  function renderTraining() {
    return trainings.slice(0,3).map(training => {
      var img;
      if(training.type === "Strength" || training.type === "Power" || training.type === "Endurance" || training.type === "Mobility" || training.type === "Stability" || training.type === "Recovery")
        img = <img className="training-img" src={physicalImg} alt='profile' />;
      else if(training.type === "Passing" || training.type === "Tackling" || training.type === "Positioning" || training.type === "Ball Control" || training.type === "Possesion" || training.type === "Finishing")
        img = <img className="training-img" src={technicalImg} alt='profile' />;
      else if(training.type === "Set Pieces" || training.type === "Formations" || training.type === "Attacking" || training.type === "Defensive")
        img = <img className="training-img" src={tacticalImg} alt='profile' />;
      
        return (
          <div key={training._id} className='inner-card-training'>
            <div className='training-image'>
              {img}
            </div>
            <div className="training-info">
              <div className='training-remove-button'>
                <button className='training-remove-button' onClick={() => handleRemoveTraining(training._id)}>X</button>
              </div>
              <div className='training-title'>{training.type}</div>
              <div className='training-duration'>{training.duration} minutes</div>
              <div className='training-description'>{training.description}</div>
              <div className='training-date'>{training.time.substring(0, 10).split('-').reverse().join('/')}</div>
              <div className='training-complete-button'>
                <button className='training-complete-button' onClick={() => handleStatusUpdate(training._id)}>Complete</button>
              </div>
            </div>
            
          </div>
        );
    });
  }

  return (
    <>
      <body className='dashboard-page'>
        <header className='dashboard-header'> 
          <p className='logo-title'>Footy.</p>
        </header>
        <section className='dashboard-sidebar'> 
          <button className='button' onClick={() => navigate('/dashboard')}> D </button>
          <button className='button' onClick={() => navigate('/training')}> T </button>
          <button className='button' onClick={() => navigate('/profile')}> P </button>
        </section>
        <main className='dashboard-main'> 
        <div className='card-user'>
          <div className='inner-card-user'> 
            <div className='hello-user'> {name} {surname}</div> 
          </div>
          <div className='inner-card-position'>
            <div className='position'> Position: {userInfo.position}</div>
          </div>
          <div className='inner-card-focus'> 
              <div className='focus-image'> 
                <img className="focus-img" src={technicalImg} alt='profile' />  
              </div>
              <div className='focus-title'> {whatToFocus()} </div>
          </div>
          <div className='inner-card-statistics'> 
            <div className='statistic-title'> Statistics</div>
              {renderStatistics()}
            </div>
        </div>
        <div className='card-weight'>
          <div className='weight-title'> Weight</div>
          <div className='weight-value'> {userInfo.weight} kg</div>
        </div>
        <div className='card-progress'>
          <div className='weight-title'> Height</div>
          <div className='weight-value'> {userInfo.height} cm</div>
        </div>
        <div className='card-day'>
          <div className='day-title'>Day</div>
          <div className='day-value'> { date } </div>
        </div>
        <div className='card-training-complete'>
          <div className='statistic-training'>
              <Circle
                percent={trainingStatistic} 
                strokeColor="#1c1f23"
                strokeWidth={6}
                trailWidth={6}
              />
              <div>Trainings</div>
            </div>
        </div>
        <div className='card-training'>
          {renderTraining()}
        </div>
        </main>
      </body>
    </>
  );
};

export default Dashboard;
