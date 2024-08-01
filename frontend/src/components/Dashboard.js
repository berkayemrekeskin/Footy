import React from 'react';
import { getAllTrainings, getTraining, getUserInfo, getAllMatches, getMatch} from '../api/api';
import { useNavigate } from 'react-router-dom';
import "../styles/Dashboard.css";
import { Circle } from 'rc-progress';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Sector, Cell} from 'recharts';
import forward from "../img/forward.png";
import midfielder from "../img/midfielder.png";
import defender from "../img/defender.png";
import goalkeeper from "../img/goalkeeper.png";
import { all } from 'axios';
const COLORS = ['#4535C1', '#478CCF', '#36C2CE', '#77E4C8'];

const Dashboard = () => {

  const [userInfo, setUserInfo] = React.useState({});
  const [updatedInfo, setUpdatedInfo] = React.useState({});
  const [matchPoints, setMatchPoints] = React.useState([]);
  const [trainings, setTrainings] = React.useState([]);
  const [matches, setMatches] = React.useState([]);
  const [dates, setDates] = React.useState([]);
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

        const temp_dates = [];
        for(let i = 0; i < matches.length; i++)
        {
          let match = await getMatch(matches[i]._id, token);
          let date = match.date;
          date = date.split('T')[0];
          date = date.split('-').reverse().join('/');
          temp_dates[i] = date;
        }

        setDates(temp_dates);
        console.log('dates:', dates);


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


  React.useEffect(() => {
    if (matches.length > 0) {
      for (let i = 0; i < matches.length; i++)
        matchPointCalculation(matches[i], i);
      positionPointCalculation();
    }
  }, [matches]);


  const renderPositionIcon = (position) => {
    if(position === "Right Wing" || position === "Left Wing" || position === "Center Forward")
      return forward;
    if(position === 'Central Midfield' || position === 'Right Midfield' || position === 'Left Midfield' 
      || position === 'Center Defensive Midfield' || position === 'Center Attacking Midfield')
      return midfielder;
    if(position === 'Center Back' || position === 'Right Back' || position === 'Left Back')
      return defender;
    if(position === 'Goalkeeper')
      return goalkeeper;
  }

  const returnPosition = () => {
    if(userInfo.position === 'Right Wing' || userInfo.position === 'Left Wing' || userInfo.position === 'Center Forward')
      return 'Forward';
    if(userInfo.position === 'Central Midfield' || userInfo.position === 'Right Midfield' || userInfo.position === 'Left Midfield'
      || userInfo.position === 'Center Defensive Midfield' || userInfo.position === 'Center Attacking Midfield')
      return 'Midfielder';
    if(userInfo.position === 'Center Back' || userInfo.position === 'Right Back' || userInfo.position === 'Left Back')
      return 'Defender';
    if(userInfo.position === 'Goalkeeper')
      return 'Goalkeeper';
  }

  const matchPointCalculation = (match,index) => {
    const position = returnPosition();
    console.log("matchleng" , matches.length);
    let point = -1;
    let minutePoint, goalPoint, assistPoint, shotPoint, passPoint, tacklePoint, 
    dribblePoint, savePoint, goalConcededPoint, yellowCardPoint, redCardPoint;
    if(position === 'Forward')
    {
      minutePoint = match.minutes_played * 0.1;
      goalPoint = match.goals_scored * 5;
      assistPoint = match.assists * 3;
      shotPoint = (match.shots_on_target / match.total_shots) * 0.5;
      passPoint = (match.passes_completed / match.total_passes) * 0.3;
      tacklePoint = (match.tackles_completed / match.total_tackles) * 0.2;
      dribblePoint = (match.dribbles_completed / match.total_dribbles) * 0.2;
      savePoint = 0;
      goalConcededPoint = 0;
      if(match.yellow_card)
        yellowCardPoint = -2;
      else 
        yellowCardPoint = 0;
      if(match.red_card)
        redCardPoint = -5;
      else
        redCardPoint = 0;
      point = minutePoint + goalPoint + assistPoint + shotPoint + passPoint + tacklePoint + dribblePoint + savePoint + goalConcededPoint + yellowCardPoint + redCardPoint;
      console.log('point & pos', point, position);
      matchPoints[index] = point;
    }
    if(position === 'Midfielder')
    {
      minutePoint = match.minutes_played * 0.1;
      goalPoint = match.goals_scored * 3;
      assistPoint = match.assists * 5;
      shotPoint = (match.shots_on_target / match.total_shots) * 0.1;
      passPoint = (match.passes_completed / match.total_passes) * 0.2;
      tacklePoint = (match.tackles_completed / match.total_tackles) * 0.5;
      dribblePoint = (match.dribbles_completed / match.total_dribbles) * 0.1;
      savePoint = 0;
      goalConcededPoint = 0;
      if(match.yellow_card)
        yellowCardPoint = -2;
      else 
        yellowCardPoint = 0;
      if(match.red_card)
        redCardPoint = -5;
      else
        redCardPoint = 0;
      point = minutePoint + goalPoint + assistPoint + shotPoint + passPoint + tacklePoint + dribblePoint + savePoint + goalConcededPoint + yellowCardPoint + redCardPoint;
      console.log('point & pos', point, position);
      matchPoints[index] = point;
    }
    if(position === 'Defender')
    {
      minutePoint = match.minutes_played * 0.1;
      goalPoint = match.goals_scored * 1;
      assistPoint = match.assists * 3;
      shotPoint = (match.shots_on_target / match.total_shots) * 0.1;
      passPoint = (match.passes_completed / match.total_passes) * 0.2;
      tacklePoint = (match.tackles_completed / match.total_tackles) * 0.5;
      dribblePoint = (match.dribbles_completed / match.total_dribbles) * 0.1;
      savePoint = 0;
      goalConcededPoint = 0;
      if(match.yellow_card)
        yellowCardPoint = -2;
      else 
        yellowCardPoint = 0;
      if(match.red_card)
        redCardPoint = -5;
      else
        redCardPoint = 0;
      point = minutePoint + goalPoint + assistPoint + shotPoint + passPoint + tacklePoint + dribblePoint + savePoint + goalConcededPoint + yellowCardPoint + redCardPoint;
      console.log('point & pos', point, position);
      matchPoints[index] = point;
    }
    if(position === 'Goalkeeper')
    {
      minutePoint = match.minutes_played * 0.1;
      goalPoint = match.goals_scored * 0;
      assistPoint = match.assists * 0;
      shotPoint = 0;
      passPoint = 0;
      tacklePoint = 0;
      dribblePoint = 0;
      savePoint = match.saves * 5;
      goalConcededPoint = match.goals_conceded * -3;
      if(match.yellow_card)
        yellowCardPoint = -2;
      else 
        yellowCardPoint = 0;
      if(match.red_card)
        redCardPoint = -5;
      else
        redCardPoint = 0;
      point = minutePoint + goalPoint + assistPoint + shotPoint + passPoint + tacklePoint + dribblePoint + savePoint + goalConcededPoint + yellowCardPoint + redCardPoint;
      matchPoints[index] = point;
      console.log('point & pos', point, position);
    }
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

  const monthlyMatchData = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
    { name: 'Aug', uv: 3490, pv: 4300, amt: 2100 },
    { name: 'Sep', uv: 3490, pv: 4300, amt: 2100 },
    { name: 'Oct', uv: 3490, pv: 4300, amt: 2100 },
    { name: 'Nov', uv: 3490, pv: 4300, amt: 2100 },
    { name: 'Dec', uv: 3490, pv: 4300, amt: 2100 }
  ];


  const test = [
    { name: `${dates[0]}`, uv: matchPoints[0], pv: 2400, amt: 2400 },
    { name: `${dates[1]}`, uv: matchPoints[1], pv: 1398, amt: 2210 },
    { name: `${dates[2]}`, uv: matchPoints[2], pv: 9800, amt: 2290 },
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
                <PolarGrid stroke='#4535C1'/>
                <PolarAngleAxis dataKey="subject"/>
                <PolarRadiusAxis />
                <Radar name="Stats" dataKey="A"  stroke="#77E4C8" fill="#478CCF" fillOpacity={0.6}/>
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
          <div className='latest-match-title'>
            <p className='mini-header'> Latest Matches Overview </p>
          </div>
          <ResponsiveContainer width="100%" height="70%">
            <PieChart width={500} height={200}>
              <Pie
                data={test}
                innerRadius={100}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={6}
                dataKey="uv"
              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.subject} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className='card-general-matches'>
          <div className='general-matches-title'> 
            <p className='mini-header'> Monthly Matches Overview </p>
          </div>
          <ResponsiveContainer width="100%" height="70%">
            <AreaChart
              width={500}
              height={400}
              data={test}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="uv" stroke="#77E4C8" fill="#4535C1" strokeWidth={5}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        </main>
      </body>
    </>
  );
};

export default Dashboard;
