import React from 'react';
import { getAllTrainings, getTraining, getUserInfo, getAllMatches, getMatch} from '../api/api';
import { useNavigate } from 'react-router-dom';
import "../styles/Dashboard.css";
import { Circle } from 'rc-progress';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import forward from "../img/forward.png";
import midfielder from "../img/midfielder.png";
import defender from "../img/defender.png";
import goalkeeper from "../img/goalkeeper.png";

const Dashboard = () => {

  const [userInfo, setUserInfo] = React.useState({});
  const [updatedInfo, setUpdatedInfo] = React.useState({});
  const [trainings, setTrainings] = React.useState([]);
  const [matches, setMatches] = React.useState([]);
  const [error, setError] = React.useState(null);
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
        const matches = await getAllMatches(token);
        let currentDate = new Date();
        currentDate = currentDate.toISOString().slice(0, 10);
        currentDate = currentDate.split('-').reverse().join('/');

        userInfo.pace = Math.floor(Math.random() * 100);
        userInfo.shooting = Math.floor(Math.random() * 100);
        userInfo.passing = Math.floor(Math.random() * 100);
        userInfo.dribbling = Math.floor(Math.random() * 100);
        userInfo.defending = Math.floor(Math.random() * 100);
        userInfo.physical = Math.floor(Math.random() * 100);

        setDate(currentDate);
        setUserInfo(userInfo);
        setTrainings(trainings);
        setMatches(matches);

        positionPointCalculation();


        console.log('userId:', userId);
        console.log('infoId:', infoId);
        console.log('token:', token);
        console.log('userInfo:', userInfo);
        console.log('trainings:', trainings);
        console.log('matches:', matches);

        let count = 0;
        for(let i = 0; i < trainings.length; i++)
          if(trainings[i].status === true)
            count++;

        setTrainingStatistic(count / trainings.length * 100);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred while fetching data.");
      }
    };
    fetchData();
  }, []);




  const renderPositionIcon = (position) => {
    if(position === "Right Wing" || position === "Left Wing" || position === "Center Forward")
      return forward;
    if(position === 'Central Midfielder' || position === 'Right Midfielder' || position === 'Left Midfielder' 
      || position === 'Center Defensive Midfielder' || position === 'Center Attacking Midfielder')
      return midfielder;
    if(position === 'Center Back' || position === 'Right Back' || position === 'Left Back')
      return defender;
    if(position === 'Goalkeeper')
      return goalkeeper;
  }

  const returnPosition = () => {
    if(userInfo.position === 'Right Wing' || userInfo.position === 'Left Wing' || userInfo.position === 'Center Forward')
      return 'Forward';
    if(userInfo.position === 'Central Midfielder' || userInfo.position === 'Right Midfielder' || userInfo.position === 'Left Midfielder'
      || userInfo.position === 'Center Defensive Midfielder' || userInfo.position === 'Center Attacking Midfielder')
      return 'Midfielder';
    if(userInfo.position === 'Center Back' || userInfo.position === 'Right Back' || userInfo.position === 'Left Back')
      return 'Defender';
    if(userInfo.position === 'Goalkeeper')
      return 'Goalkeeper';
  }

  const positionPointCalculation = () => {
    let position = returnPosition();
    if(position === 'Forward')
    {
      updatedInfo.pace = userInfo.pace * 0.3;
      updatedInfo.shooting = userInfo.shooting * 0.2;
      updatedInfo.passing = userInfo.passing * 0.2;
      updatedInfo.dribbling = userInfo.dribbling * 0.2;
      updatedInfo.defending = userInfo.defending * 0.1;
      updatedInfo.physical = userInfo.physical * 0.1;
    }      
    if(position === 'Midfielder')
    {
      updatedInfo.pace = userInfo.pace * 0.2;
      updatedInfo.shooting = userInfo.shooting * 0.2;
      updatedInfo.passing = userInfo.passing * 0.3;
      updatedInfo.dribbling = userInfo.dribbling * 0.2;
      updatedInfo.defending = userInfo.defending * 0.1;
      updatedInfo.physical = userInfo.physical * 0.1;
    }
    if(position === 'Defender')
    {
      updatedInfo.pace = userInfo.pace * 0.1;
      updatedInfo.shooting = userInfo.shooting * 0.1;
      updatedInfo.passing = userInfo.passing * 0.1;
      updatedInfo.dribbling = userInfo.dribbling * 0.1;
      updatedInfo.defending = userInfo.defending * 0.4;
      updatedInfo.physical = userInfo.physical * 0.2;
    }
    if(position === 'Goalkeeper')
    {
      updatedInfo.pace = userInfo.pace * 0.1;
      updatedInfo.shooting = userInfo.shooting * 0.1;
      updatedInfo.passing = userInfo.passing * 0.1;
      updatedInfo.dribbling = userInfo.dribbling * 0.1;
      updatedInfo.defending = userInfo.defending * 0.1;
      updatedInfo.physical = userInfo.physical * 0.5;
    }
    return [updatedInfo.pace, updatedInfo.shooting, updatedInfo.passing, updatedInfo.dribbling, updatedInfo.defending, updatedInfo.physical];
  }

  const focusPointCalculation = () => {
    let stats = positionPointCalculation();
    console.log('stats:', stats);
    let min = findMin(stats);
    switch(min)
    {
      case stats[0]:
        return 'Pace';
      case stats[1]:
        return 'Shooting';
      case stats[2]:
        return 'Passing';
      case stats[3]:
        return 'Dribbling';
      case stats[4]:
        return 'Defending';
      case stats[5]:
        return 'Physical';
    }
  }

  const findMin = (array) => {
    let min = 100;
    for(let i = 0; i < array.length; i++)
      if(array[i] < min)
        min = array[i];
    return min;
  }

  const chartData = [
    { subject: 'Pace', A: updatedInfo.pace },
    { subject: 'Shooting', A: updatedInfo.shooting },
    { subject: 'Passing', A: updatedInfo.passing },
    { subject: 'Dribbling', A: updatedInfo.dribbling },
    { subject: 'Defending', A: updatedInfo.defending },
    { subject: 'Physical', A: updatedInfo.physical }
  ];

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
            <div className='hello-user'> {userInfo.name} {userInfo.surname}</div> 
          </div>
          <div className='inner-card-position'>
            <div className='position'> Position: {userInfo.position}</div>
          </div>
          <div className='inner-card-user-info'> 
              <img className="user-info-icon" src={renderPositionIcon(userInfo.position)} alt='position-icon' />
              <div className='user-info-details'>
                <div className='user-info'> PAC: {userInfo.pace}</div>
                <div className='user-info'> SHO: {userInfo.shooting}</div>
                <div className='user-info'> PAS: {userInfo.passing}</div>
                <div className='user-info'> DRI: {userInfo.dribbling}</div>
                <div className='user-info'> DEF: {userInfo.defending}</div>
                <div className='user-info'> PHY: {userInfo.physical}</div>
              </div>
          </div>
          <div className='inner-card-focus'> 
            <div className='focus'> <b>You need to focus on:</b> {focusPointCalculation()}</div>
            <div className='stats'>
              <RadarChart cx={200} cy={100} outerRadius={80} width={400} height={200} data={chartData} >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="Stats" dataKey="A" stroke="#1c1f23" fill="#1c1f23" fillOpacity={0.6} />
              </RadarChart>
            </div>
          </div>
        </div>
        <div className='card-training'>
          <div className='inner-card-training'>
            <div className='latest-training-title'> Latest Training </div>
          </div>
          <div className='inner-card-training'>
            <div className='monthly-training-title'> Monthly Training </div>
          </div>
          <div className='inner-card-training'>
            <div className='training-statistic-title'> Training Statistic </div>

          </div>
        </div>
        <div className='card-latest-match'>
        </div>
        <div className='card-general-matches'>
        </div>
        </main>
      </body>
    </>
  );
};

export default Dashboard;
