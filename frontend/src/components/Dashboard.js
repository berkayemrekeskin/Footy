import React from 'react';
import { getAllTrainings, getTraining, getUserInfo } from '../api/api';
import { useNavigate } from 'react-router-dom';
import "../styles/Dashboard.css";
import { Circle } from 'rc-progress';

const Dashboard = () => {

  const [userInfo, setUserInfo] = React.useState({});
  const [trainings, setTrainings] = React.useState([]);
  const [selectedTraining, setSelectedTraining] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [name, setName] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [date, setDate] = React.useState('');
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

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred while fetching data.");
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <body className='dashboard-page'>
        <header className='dashboard-header'> Header </header>
        <section className='dashboard-sidebar'> 
          <button className='button' onClick={() => navigate('/dashboard')}> D </button>
          <button className='button' onClick={() => navigate('/training')}> T </button>
          <button className='button' onClick={() => navigate('/nutritions')}> N </button>
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
          <div className='inner-card'> What to focus</div>
          <div className='inner-card-statistics'> 
            <div className='statistic-title'> Statistics </div>
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
        <div className='card-weather'>Current Weather</div>
        <div className='card-training'>
          <div className='inner-card'>
            <div className='training'>
              <div className='training-title'>Training 1</div>
              <div className='training-duration'>Duration</div>
              <div className='training-description'>Description</div>
              <div className='training-date'>Date</div>
            </div>
          </div>
          <div className='inner-card'>
            <div className='training'>
              <div className='training-title'>Training 2</div>
              <div className='training-duration'>Duration</div>
              <div className='training-description'>Description</div>
              <div className='training-date'>Date</div>
            </div>
          </div>
          <div className='inner-card'>
            <div className='training'>
              <div className='training-title'>Training 3</div>
              <div className='training-duration'>Duration</div>
              <div className='training-description'>Description</div>
              <div className='training-date'>Date</div>
            </div>
          </div>
        </div>
        </main>
      </body>
    </>
  );
};

export default Dashboard;
