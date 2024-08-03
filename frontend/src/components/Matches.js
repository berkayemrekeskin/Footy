import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMatches, getMatch, createMatch, getUserInfo} from '../api/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Calendar from 'react-calendar';
import { Circle } from 'rc-progress';
import "../styles/Matches.css";

const Matches = () => {

    const [formData, setFormData] = useState({
        position: undefined,
        minutes_played: undefined,
        goals_scored: undefined,
        assists: undefined,
        yellow_card: undefined,
        red_card: undefined,
        total_shots: undefined,
        shots_on_target: undefined,
        total_passes: undefined,
        passes_completed: undefined,
        total_dribbles: undefined,
        dribbles_completed: undefined,
        total_tackles: undefined,
        tackles_completed: undefined,
        saves: undefined,
        goals_conceded: undefined,
    });        
    const [matches, setMatches] = useState([]);
    const [match, setMatch] = useState({});
    const [userInfo, setUserInfo] = useState({});
    const [updatedInfo, setUpdatedInfo] = useState({});
    const [matchPoints, setMatchPoints] = useState([]);
    const [matchDates, setmatchDates] = useState([]);
    const [overallMatchPoint, setOverallMatchPoint] = useState(0);
    const [date, setDate] = useState(new Date());
    const [selectedDates, setSelectedDates] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('token'));
                const userId = JSON.parse(localStorage.getItem('userId'));
                const infoId = JSON.parse(localStorage.getItem(`infoID${userId}`));
                const matches = await getAllMatches(token);
                const userInfo = await getUserInfo(infoId, token);
                

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
                setmatchDates(temp_matchDates);
                setMatches(matches);
                setUserInfo(userInfo);
                console.log(overallMatchPoint);
                console.log(matches);
                console.log(userInfo);

            }
            catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (matches.length > 0) {
          for (let i = 0; i < matches.length; i++)
          {
            matchPointCalculation(matches[i], i);
            console.log('matchPoints INSIDE USEEFFECT:', matchPoints);
            matches[i].overall = matchPoints[i];
            console.log('matches[i].overall:', matches[i].overall);
            positionPointCalculation();
            let overallPoint = 0;
            for(let i = 0; i < matches.length; i++)
            {
                overallPoint += matchPoints[i];
            }
            overallPoint = parseFloat((overallPoint / matches.length).toFixed(2));
            setOverallMatchPoint(overallPoint);

          }
        }
    }, [matches]);


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
        minutePoint = goalPoint = assistPoint = shotPoint = passPoint = tacklePoint = dribblePoint = savePoint = goalConcededPoint = yellowCardPoint = redCardPoint = 0;
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
          console.log('point & pos tewst', point, position);
        }
    
        setUserInfo((prevInfo) => ({
          ...prevInfo,
          pace: prevInfo.pace + parseFloat(minutePoint.toFixed(2)),
          shooting: prevInfo.shooting + parseFloat(((goalPoint + shotPoint) / 2).toFixed(2)),
          passing: prevInfo.passing + parseFloat(((passPoint + assistPoint) / 2).toFixed(2)),
          dribbling: prevInfo.dribbling + parseFloat(dribblePoint.toFixed(2)),
          defending: prevInfo.defending + parseFloat(((tacklePoint + goalConcededPoint) / 2).toFixed(2)),
          physical: prevInfo.physical + parseFloat(((tacklePoint + yellowCardPoint + redCardPoint) / 3).toFixed(2))
    
        }));
    
        console.log('userInfo after Match:', userInfo);
    
      }

      const positionPointCalculation = () => {
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
    
        console.log('updatedInfo:', updatedInfo);
        return [updatedInfo.pace, updatedInfo.shooting, updatedInfo.passing, updatedInfo.dribbling, updatedInfo.defending, updatedInfo.physical];
      }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Form data:', formData);
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await createMatch(formData, token);
            console.log('Match created:', response);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating match:', error);
        }
    }

    const renderGoalkeeper = () => {
        return (
            <>
                <input className='match-create-input' type="text" name="position" placeholder="Position" onChange={handleChange} />
                <input className='match-create-input' type="number" name="minutes_played" placeholder="Minutes Played" onChange={handleChange} />
                <input className='match-create-input' type="number" name="saves" placeholder="Saves" onChange={handleChange} />
                <input className='match-create-input' type="number" name="goals_conceded" placeholder="Goals Conceded" onChange={handleChange} />
            </>
        );
    }

    const renderPlayer = () => {
        return (
            <>
                <input className='match-create-input' type="text" name="position" placeholder="Position" onChange={handleChange} />
                <input className='match-create-input' type="number" name="minutes_played" placeholder="Minutes Played" onChange={handleChange} />
                <input className='match-create-input' type="number" name="goals_scored" placeholder="Goals Scored" onChange={handleChange} />
                <input className='match-create-input' type="number" name="assists" placeholder="Assists" onChange={handleChange} />
                <input className='match-create-input' type="number" name="yellow_card" placeholder="Yellow Card" onChange={handleChange} />
                <input className='match-create-input' type="number" name="red_card" placeholder="Red Card" onChange={handleChange} />
                <input className='match-create-input' type="number" name="total_shots" placeholder="Total Shots" onChange={handleChange} />
                <input className='match-create-input' type="number" name="shots_on_target" placeholder="Shots on Target" onChange={handleChange} />
                <input className='match-create-input' type="number" name="total_passes" placeholder="Total Passes" onChange={handleChange} />
                <input className='match-create-input' type="number" name="passes_completed" placeholder="Passes Completed" onChange={handleChange} />
                <input className='match-create-input' type="number" name="total_dribbles" placeholder="Total Dribbles" onChange={handleChange} />
                <input className='match-create-input' type="number" name="dribbles_completed" placeholder="Dribbles Completed" onChange={handleChange} />
                <input className='match-create-input' type="number" name="total_tackles" placeholder="Total Tackles" onChange={handleChange} />
                <input className='match-create-input' type="number" name="tackles_completed" placeholder="Tackles Completed" onChange={handleChange} />
            </>
        );
    }

    const checkGoalkeeper = () => {
        if (userInfo.position === 'Goalkeeper') {
            return renderGoalkeeper();
        }
        else 
        {
            return renderPlayer();
        }
    }

    const test = [
        { name: `${matchDates[0]}`, uv: matchPoints[0]},
        { name: `${matchDates[1]}`, uv: matchPoints[1]},
        { name: `${matchDates[2]}`, uv: matchPoints[2]},
        { name: `${matchDates[3]}`, uv: matchPoints[3]},
        { name: `${matchDates[4]}`, uv: matchPoints[4]},
      ];

    return (
        <>
          <body className="matches-page"> 
              <header className="matches-header">
                <p className='logo-title'>Footy.</p>
              </header>
              <sidebar className="matches-sidebar">
                  <button className='button' onClick={() => navigate('/dashboard')}> D </button>
                  <button className='button' onClick={() => navigate('/training')}> T </button>
                <button className='button' onClick={() => navigate('/matches')}> M </button>
                <button className='button' onClick={() => navigate('/profile')}> P </button>
              </sidebar>
              <main className="matches-main">
                <div className="create-matches-card">
                    <div className="create-matches-title">
                        Create Match
                    </div>
                    <form className="create-matches-form" onSubmit={handleSubmit}>
                        {checkGoalkeeper()}
                        <button className='match-create-button' type="submit">Create Match</button>
                    </form>
                </div>  
                <div className = "all-matches-card">
                    <div className="all-matches-title">
                        <p>All Matches</p>
                    </div>
                    <div className="all-matches-list">

                        <div className="latest-match-circle">
                            <Circle
                                percent={test[0].uv} 
                                trailColor='#77E4C8'
                                strokeColor="#4535C1"
                                strokeWidth={6}
                                trailWidth={6}
                            />
                        </div>
                        <div className="latest-match-circle">
                            <Circle
                                percent={test[1].uv} 
                                trailColor='#77E4C8'
                                strokeColor="#4535C1"
                                strokeWidth={6}
                                trailWidth={6}
                            />
                        </div>
                        <div className="latest-match-circle">
                            <Circle
                                percent={test[2].uv} 
                                trailColor='#77E4C8'
                                strokeColor="#4535C1"
                                strokeWidth={6}
                                trailWidth={6}
                            />
                        </div>
                        <div className="latest-match-circle">
                            <Circle
                                percent={test[3].uv} 
                                trailColor='#77E4C8'
                                strokeColor="#4535C1"
                                strokeWidth={6}
                                trailWidth={6}
                            />
                        </div>
                        <div className="latest-match-circle">
                            <Circle
                                percent={test[4].uv} 
                                trailColor='#77E4C8'
                                strokeColor="#4535C1"
                                strokeWidth={6}
                                trailWidth={6}
                            />
                        </div>
                    </div>
                </div>
                <div className='calendar-card'>
                    <Calendar />
                </div>
                <div className="latest-match-card">
                    <div className="latest-match-title">
                        <p>Latest Match</p>
                    </div>
                    <div className="latest-match-circle">
                        <Circle
                            percent={matchPoints[matches.length - 1]} 
                            trailColor='#77E4C8'
                            strokeColor="#4535C1"
                            strokeWidth={6}
                            trailWidth={6}
                        />
                    </div>
                </div>
                <div className='overall-matches-card'>
                    <div className="overall-matches-title">
                        <p>Overall Matches</p>
                    </div>
                    <div className="overall-matches-circle">
                        <Circle
                            percent={overallMatchPoint} 
                            trailColor='#77E4C8'
                            strokeColor="#4535C1"
                            strokeWidth={6}
                            trailWidth={6}
                        />
                    </div>
                </div>
                <div className='match-statistics-card'>
                    <ResponsiveContainer width="100%" height="90%">
                        <AreaChart
                        width={500}
                        height={200}
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
}

export default Matches;