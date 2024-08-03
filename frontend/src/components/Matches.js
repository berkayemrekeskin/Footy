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
                setMatches(matches);
                const userInfo = await getUserInfo(infoId, token);
                setUserInfo(userInfo);

                console.log(matches);
                console.log(userInfo);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

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
                                percent={10} 
                                trailColor='#77E4C8'
                                strokeColor="#4535C1"
                                strokeWidth={6}
                                trailWidth={6}
                            />
                        </div>
                        <div className="latest-match-circle">
                            <Circle
                                percent={10} 
                                trailColor='#77E4C8'
                                strokeColor="#4535C1"
                                strokeWidth={6}
                                trailWidth={6}
                            />
                        </div>
                        <div className="latest-match-circle">
                            <Circle
                                percent={10} 
                                trailColor='#77E4C8'
                                strokeColor="#4535C1"
                                strokeWidth={6}
                                trailWidth={6}
                            />
                        </div>
                        <div className="latest-match-circle">
                            <Circle
                                percent={10} 
                                trailColor='#77E4C8'
                                strokeColor="#4535C1"
                                strokeWidth={6}
                                trailWidth={6}
                            />
                        </div>
                        <div className="latest-match-circle">
                            <Circle
                                percent={10} 
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
                            percent={10} 
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
                            percent={40} 
                            trailColor='#77E4C8'
                            strokeColor="#4535C1"
                            strokeWidth={6}
                            trailWidth={6}
                        />
                    </div>
                </div>
                <div className='match-statistics-card'>
                    <ResponsiveContainer width="100%" height="80%">
                        <AreaChart
                        width={500}
                        height={200}
                        data={10}
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