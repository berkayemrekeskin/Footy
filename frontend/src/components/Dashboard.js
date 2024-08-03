import React from 'react';
import { getAllTrainings, getTraining, getUserInfo, getAllMatches, getMatch, updateUserInfo} from '../api/api';
import { useNavigate } from 'react-router-dom';
import "../styles/Dashboard.css";
import { Circle } from 'rc-progress';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { AreaChart,Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart } from 'recharts';
import { PieChart, Pie, Cell} from 'recharts';
import forward from "../img/forward.png";
import midfielder from "../img/midfielder.png";
import defender from "../img/defender.png";
import goalkeeper from "../img/goalkeeper.png";
import { all } from 'axios';
const COLORS = ['#4535C1', '#478CCF', '#36C2CE', '#77E4C8'];

const Dashboard = () => {

  const [userInfo, setUserInfo] = React.useState({});
  const [matchPoints, setMatchPoints] = React.useState([]);
  const [trainings, setTrainings] = React.useState([]);
  const [matches, setMatches] = React.useState([]);
  const [matchDates, setmatchDates] = React.useState([]);
  const [trainingDates, setTrainingDates] = React.useState([]);
  const [trainingPoints, setTrainingPoints] = React.useState([]);
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
        const temp_matchDates = [];
        for(let i = 0; i < matches.length; i++)
        {
          let match = await getMatch(matches[i]._id, token);
          let date = match.date;
          date = date.split('T')[0];
          date = date.split('-').reverse().join('/');
          date = date.substring(0, 5);
          temp_matchDates[i] = date;
        }
        let count = 0;
        for(let i = 0; i < trainings.length; i++)
          if(trainings[i].status === true)
            count++;

        const temp_trainingDates = [];
        for(let i = 0; i < trainings.length; i++)
        {
          let training = await getTraining(trainings[i]._id, token);
          let date = training.date;
          date = date.split('T')[0];
          date = date.split('-').reverse().join('/');
          date = date.substring(0, 5);
          temp_trainingDates[i] = date;
        }
        const temp_trainingPoints = [];
        for(let i = 0; i < trainings.length; i++)
        {
          let training = await getTraining(trainings[i]._id, token);
          temp_trainingPoints[i] = training.effect_value;
        }

        setTrainingPoints(temp_trainingPoints);
        setTrainingDates(temp_trainingDates);
        setUserInfo(userInfo);
        setTrainings(trainings);
        setMatches(matches);
        setDate(currentDate);
        setmatchDates(temp_matchDates);
        setTrainingStatistic(count / trainings.length * 100);

        console.log(userInfo);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred while fetching data.");
      }
    };
    fetchData();
  }, []);


  React.useEffect(() => {
    const calculateAndUpdate = async () => {

      const userPoints = [];
      let pace, shooting, passing, dribbling, defending, physical;
      pace = shooting = passing = dribbling = defending = physical = 0;

      if (matches.length > 0) {
        for (let i = 0; i < matches.length; i++)
        {
          let stats = matchPointCalculation(matches[i], i);
          pace += stats[0];
          shooting += stats[1];
          passing += stats[2];
          dribbling += stats[3];
          defending += stats[4];
          physical += stats[5];
          matches[i].overall = matchPoints[i];
        }

        pace = parseFloat((pace / matches.length).toFixed(2));
        shooting = parseFloat((shooting / matches.length).toFixed(2));
        passing = parseFloat((passing / matches.length).toFixed(2));
        dribbling = parseFloat((dribbling / matches.length).toFixed(2));
        defending = parseFloat((defending / matches.length).toFixed(2));
        physical = parseFloat((physical / matches.length).toFixed(2));

        const token = JSON.parse(localStorage.getItem('token'));
        const userId = JSON.parse(localStorage.getItem('userId'));
        const infoId = JSON.parse(localStorage.getItem(`infoID${userId}`)); 

        const updatedInfo = await updateUserInfo(infoId, { pace, shooting, passing, dribbling, defending, physical }, token);
        console.log("UPDATE: ",updatedInfo);

        let userPoints = positionPointCalculation();

        setUserInfo(updatedInfo);

        console.log("USER POINTS: ", userPoints);
      }

    };
    calculateAndUpdate();
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
    let point = -1;
    let minutePoint, goalPoint, assistPoint, shotPoint, passPoint, tacklePoint, 
    dribblePoint, savePoint, goalConcededPoint, yellowCardPoint, redCardPoint;
    if(position === 'Forward')
    {
      minutePoint = parseFloat((match.minutes_played * 0.1).toFixed(2));
      goalPoint = parseFloat((match.goals_scored * 5).toFixed(2));
      assistPoint = parseFloat((match.assists * 3).toFixed(2));
      shotPoint = parseFloat(((match.shots_on_target / match.total_shots) * 0.5).toFixed(2));
      passPoint = parseFloat(((match.passes_completed / match.total_passes) * 0.3).toFixed(2));
      tacklePoint = parseFloat(((match.tackles_completed / match.total_tackles) * 0.2).toFixed(2));
      dribblePoint = parseFloat(((match.dribbles_completed / match.total_dribbles) * 0.2).toFixed(2));
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
      matchPoints[index] = point;
    }
    if(position === 'Midfielder')
    {
      minutePoint = parseFloat((match.minutes_played * 0.1).toFixed(2));
      goalPoint = parseFloat((match.goals_scored * 3).toFixed(2));
      assistPoint = parseFloat((match.assists * 5).toFixed(2));
      shotPoint = parseFloat(((match.shots_on_target / match.total_shots) * 0.1).toFixed(2));
      passPoint = parseFloat(((match.passes_completed / match.total_passes) * 0.2).toFixed(2));
      tacklePoint = parseFloat(((match.tackles_completed / match.total_tackles) * 0.5).toFixed(2));
      dribblePoint = parseFloat(((match.dribbles_completed / match.total_dribbles) * 0.1).toFixed(2));
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
      matchPoints[index] = point;
    }
    if(position === 'Defender')
    {
      minutePoint = parseFloat((match.minutes_played * 0.1).toFixed(2));
      goalPoint = parseFloat((match.goals_scored * 1).toFixed(2));
      assistPoint = parseFloat((match.assists * 3).toFixed(2));
      shotPoint = parseFloat(((match.shots_on_target / match.total_shots) * 0.1).toFixed(2));
      passPoint = parseFloat(((match.passes_completed / match.total_passes) * 0.2).toFixed(2));
      tacklePoint = parseFloat(((match.tackles_completed / match.total_tackles) * 0.5).toFixed(2));
      dribblePoint = parseFloat(((match.dribbles_completed / match.total_dribbles) * 0.1).toFixed(2));
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
      matchPoints[index] = point;
    }
    if(position === 'Goalkeeper')
    {
      minutePoint = parseFloat((match.minutes_played * 0.1).toFixed(2));
      goalPoint = parseFloat((match.goals_scored * 0).toFixed(2));
      assistPoint = parseFloat((match.assists * 0).toFixed(2));
      shotPoint = 0;
      passPoint = 0;
      tacklePoint = 0;
      dribblePoint = 0;
      savePoint = parseFloat((match.saves * 5).toFixed(2));
      goalConcededPoint = parseFloat((match.goals_conceded * -3).toFixed(2));
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
    }

    console.log("uuser info",userInfo);

    let paceP, shootingP, passingP, dribblingP, defendingP, physicalP;
    paceP = parseFloat((minutePoint * 0.3).toFixed(2));
    shootingP = parseFloat(((goalPoint + shotPoint) * 0.3).toFixed(2));
    passingP = parseFloat(((assistPoint + passPoint) * 0.3).toFixed(2));
    dribblingP = parseFloat((dribblePoint * 0.3).toFixed(2));
    defendingP = parseFloat(((tacklePoint + goalConcededPoint) * 0.3).toFixed(2));
    physicalP = parseFloat(((yellowCardPoint + redCardPoint + goalConcededPoint) * 0.3).toFixed(2));

    return [paceP, shootingP, passingP, dribblingP, defendingP, physicalP];

  }

  const positionPointCalculation = () => {

    let updatedInfo = {
      pace: 0,
      shooting: 0,
      passing: 0,
      dribbling: 0,
      defending: 0,
      physical: 0      
    };
    
    let position = returnPosition();
    if(position === 'Forward')
    {
      updatedInfo.pace = parseFloat((userInfo.pace * 0.3).toFixed(2));
      updatedInfo.shooting = parseFloat((userInfo.shooting * 0.2).toFixed(2));
      updatedInfo.passing = parseFloat((userInfo.passing * 0.2).toFixed(2));
      updatedInfo.dribbling = parseFloat((userInfo.dribbling * 0.2).toFixed(2));
      updatedInfo.defending = parseFloat((userInfo.defending * 0.1).toFixed(2));
      updatedInfo.physical = parseFloat((userInfo.physical * 0.1).toFixed(2));
    }      
    if(position === 'Midfielder')
    {
      updatedInfo.pace = parseFloat((userInfo.pace * 0.2).toFixed(2));
      updatedInfo.shooting = parseFloat((userInfo.shooting * 0.2).toFixed(2));
      updatedInfo.passing = parseFloat((userInfo.passing * 0.3).toFixed(2));
      updatedInfo.dribbling = parseFloat((userInfo.dribbling * 0.2).toFixed(2));
      updatedInfo.defending = parseFloat((userInfo.defending * 0.1).toFixed(2));
      updatedInfo.physical = parseFloat((userInfo.physical * 0.1).toFixed(2));
    }
    if(position === 'Defender')
    {
      updatedInfo.pace = parseFloat((userInfo.pace * 0.1).toFixed(2));
      updatedInfo.shooting = parseFloat((userInfo.shooting * 0.1).toFixed(2));
      updatedInfo.passing = parseFloat((userInfo.passing * 0.1).toFixed(2));
      updatedInfo.dribbling = parseFloat((userInfo.dribbling * 0.1).toFixed(2));
      updatedInfo.defending = parseFloat((userInfo.defending * 0.4).toFixed(2));
      updatedInfo.physical = parseFloat((userInfo.physical * 0.2).toFixed(2));
    }
    if(position === 'Goalkeeper')
    {
      updatedInfo.pace = parseFloat((userInfo.pace * 0.1).toFixed(2));
      updatedInfo.shooting = parseFloat((userInfo.shooting * 0.1).toFixed(2));
      updatedInfo.passing = parseFloat((userInfo.passing * 0.1).toFixed(2));
      updatedInfo.dribbling = parseFloat((userInfo.dribbling * 0.1).toFixed(2));
      updatedInfo.defending = parseFloat((userInfo.defending * 0.1).toFixed(2));
      updatedInfo.physical = parseFloat((userInfo.physical * 0.5).toFixed(2));
    }
    console.log(updatedInfo);
    return [updatedInfo.pace, updatedInfo.shooting, updatedInfo.passing, updatedInfo.dribbling, updatedInfo.defending, updatedInfo.physical];
  }

  const focusPointCalculation = () => {
    let stats = positionPointCalculation();
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
    { subject: 'Pace', A: userInfo.pace },
    { subject: 'Shooting', A: userInfo.shooting },
    { subject: 'Passing', A: userInfo.passing },
    { subject: 'Dribbling', A: userInfo.dribbling },
    { subject: 'Defending', A: userInfo.defending },
    { subject: 'Physical', A: userInfo.physical }
  ];


  const test = [
    { name: `${matchDates[0]}`, uv: matchPoints[0]},
    { name: `${matchDates[1]}`, uv: matchPoints[1]},
    { name: `${matchDates[2]}`, uv: matchPoints[2]},
    { name: `${matchDates[3]}`, uv: matchPoints[3]},
    { name: `${matchDates[4]}`, uv: matchPoints[4]},
  ];

  const monthlyTrainingData = [
    { name: `${trainingDates[0]}`, uv: trainingPoints[0]},
    { name: `${trainingDates[1]}`, uv: trainingPoints[1]},
    { name: `${trainingDates[2]}`, uv: trainingPoints[2]},
    { name: `${trainingDates[3]}`, uv: trainingPoints[3]},
    { name: `${trainingDates[4]}`, uv: trainingPoints[4]},
  ];

  const trainingStatisticData = [
    { name: 'Training', uv: trainingStatistic},
    { name: 'Not Training', uv: 100 - trainingStatistic},
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
          <button className='button' onClick={() => navigate('/matches')}> M </button>
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
              <img className="user-info-icon" src={renderPositionIcon(userInfo.position)} alt='position-icon'  />
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
            <div className='latest-training-title'>
              <p className='right-header'> Latest Training Overview </p>  
            </div>
            <div className='latest-training-data'>
              <Circle
                    percent={trainings.length != 0 ? trainings[trainings.length - 1].effect_value : 0} 
                    strokeColor= "#36C2CE"
                    strokeWidth={6}
                    trailWidth={6}
                    className='training-circle'
                />
            </div>
          </div>
          <div className='inner-card-training'>
            <div className='monthly-training-title'> 
                <p className='right-header'> Monthly Training Overview </p>
            </div>
            <div className='monthly-training-data'>
              <ResponsiveContainer width="90%" height="90%">
                <LineChart width={200} height={80} data={monthlyTrainingData}>
                  <Line type="monotone" dataKey="uv" stroke='#36C2CE' strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className='inner-card-training'>
            <div className='training-statistic-title'>
              <p className='right-header'> Training Statistic </p>
            </div>
            <div className='training-statistic-data'>
              <ResponsiveContainer width="90%" height="90%">
                <PieChart width={200} height={200}>
                  <Pie
                    data={trainingStatisticData}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#36C2CE"
                    paddingAngle={6}
                    dataKey="uv"
                  >
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>  
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
