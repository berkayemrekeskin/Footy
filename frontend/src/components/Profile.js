import React from 'react';
import { getUserInfo, updateUserInfo} from '../api/api';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import { Circle } from 'rc-progress';

const Profile = () => {
    const [userInfo, setUserInfo] = React.useState(null);
    const [name, setName] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState(null);
    const [formData, setFormData] = React.useState({
        weight: undefined,  
        height: undefined,
        age: undefined,
        position: undefined,
        goals: undefined,
        assists: undefined,
        saves: undefined,
        goals_conceded: undefined,
        dribbles_tried: undefined,
        dribbles_complete: undefined,
        passes_tried: undefined,
        passes_complete: undefined,
        shots_tried: undefined,
        shots_complete: undefined,
    });
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem('userId'));
                const infoId = JSON.parse(localStorage.getItem(`infoID${userId}`));
                const token = JSON.parse(localStorage.getItem('token'));
                const userInfo = await getUserInfo(infoId, token);
                setName(JSON.parse(localStorage.getItem('name')));
                setSurname(JSON.parse(localStorage.getItem('surname')));
                setEmail(JSON.parse(localStorage.getItem('email')));
                setUserInfo(userInfo);
                console.log('userInfo:', userInfo);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message || JSON.stringify(error));
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = JSON.parse(localStorage.getItem('userId'));
            const infoId = JSON.parse(localStorage.getItem(`infoID${userId}`));
            const token = JSON.parse(localStorage.getItem('token'));
            const updatedUserInfo = await updateUserInfo(infoId, formData, token);
            console.log("User info updated:", updatedUserInfo);
            navigate('/dashboard');
        } catch (error) {
            console.error("Error updating user info:", error);
        }
    };


    function renderPosition() {
        if (!userInfo) {
            return null;
        }

        if (userInfo.position === 'Goalkeeper') {
            return (
                <div>
                    <form className="form" onSubmit={handleSubmit}>
                        <input className='valueInput' type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight" />
                        <input className='valueInput' type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" />
                        <input className='valueInput' type="number" name="saves" value={formData.saves} onChange={handleChange} placeholder="Saves" />
                    </form>
                    <form className="form" onSubmit={handleSubmit}>
                        <input className='valueInput' type="number" name="goals_conceded" value={formData.goals_conceded} onChange={handleChange} placeholder="Goals Conceded" />
                        <input className='valueInput' type="number" name="passes_tried" value={formData.passes_tried} onChange={handleChange} placeholder="Passes Tried" />
                        <input className='valueInput' type="number" name="passes_complete" value={formData.passes_complete} onChange={handleChange} placeholder="Passes Complete" />
                        <button className='button-pf' type="submit">Save</button>
                    </form>
                </div>
            );
        } else {
            return (
                <div className='form-div'>
                    <form className="form" onSubmit={handleSubmit}>
                        <input className='valueInput' type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight" />
                        <input className='valueInput' type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" />
                        <input className='valueInput' type="number" name="goals" value={formData.goals} onChange={handleChange} placeholder="Goals" />
                        <input className='valueInput' type="number" name="assists" value={formData.assists} onChange={handleChange} placeholder="Assists" />
                        <input className='valueInput' type="number" name="passes_tried" value={formData.passes_tried} onChange={handleChange} placeholder="Passes Tried" />
                    </form>
                    <form className="form" onSubmit={handleSubmit}>
                        <input className='valueInput' type="number" name="passes_complete" value={formData.passes_complete} onChange={handleChange} placeholder="Passes Complete" />
                        <input className='valueInput' type="number" name="dribbles_tried" value={formData.dribbles_tried} onChange={handleChange} placeholder="Dribbles Tried" />
                        <input className='valueInput' type="number" name="dribbles_complete" value={formData.dribbles_complete} onChange={handleChange} placeholder="Dribbles Complete" />
                        <input className='valueInput' type="number" name="shots_tried" value={formData.shots_tried} onChange={handleChange} placeholder="Shots Tried" />
                        <input className='valueInput' type="number" name="shots_complete" value={formData.shots_complete} onChange={handleChange} placeholder="Shots Complete" />
                        <button className='button-pf' type="submit">Save</button>
                   
                    </form>
                    <div>
                    </div>
                </div>
            );
        }
    }

    function renderStatistics() {
        if(userInfo.position === 'Goalkeeper') {
          return (
            <div className='statistic-container-pf'>
              <div className='statistic-pf'>
                <Circle
                  percent={userInfo.goals_conceded / userInfo.saves * 100} 
                  strokeColor="#1c1f23"
                  strokeWidth={6}
                  trailWidth={6}
                />
                <div><b>Saves</b></div>
              </div>
              <div className='statistic-pf'>
                <Circle
                  percent={userInfo.passes_complete / userInfo.passes_tried * 100} 
                  strokeColor="#1c1f23"
                  strokeWidth={6}
                  trailWidth={6}
                />
                <div><b>Passes</b></div>
              </div>
            </div>
          );
        }
        else 
        {
            return (
              <div className='statistic-container-pf'>
                <div className='statistic-pf'>
                  <Circle
                    percent={userInfo.shots_complete / userInfo.shots_tried * 100} 
                    strokeColor="#1c1f23"
                    strokeWidth={6}
                    trailWidth={6}
                  />
                  <div><b>Shots</b></div>
                </div>
                <div className='statistic-pf'>
                  <Circle
                    percent={userInfo.passes_complete / userInfo.passes_tried * 100} 
                    strokeColor="#1c1f23"
                    strokeWidth={6}
                    trailWidth={6}
                  />
                  <div><b>Passes</b></div>
                </div>
                  <div className='statistic-pf'>
                    <Circle
                      percent={userInfo.dribbles_complete / userInfo.dribbles_tried * 100} 
                      strokeColor="#1c1f23"
                      strokeWidth={6}
                      trailWidth={6}
                    />
                  <div><b>Dribbles</b></div>
                </div>
              </div>
            );
        }
      }

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className='profile-page'>
                <header className='profile-header'> 
                  <p className='logo-title'>Footy.</p>
                </header>
                <section className='profile-sidebar'> 
                    <button className='button' onClick={() => navigate('/dashboard')}> D </button>
                    <button className='button' onClick={() => navigate('/training')}> T </button>
                    <button className='button' onClick={() => navigate('/profile')}> P </button>
                </section>
                <main className='profile-main'> 
                    <div className="card-left">
                      <div className="background-card-left">
                        <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" className='profile-avatar' />
                          <p className='profile-text'><b>{name} {surname}</b></p>
                          <p className='profile-text'>{email}</p>
                          <p className='profile-text'>Position: {userInfo.position}</p>
                          <p className='profile-text'>Age: {userInfo.age}</p>
                          <p className='profile-text'>Height: {userInfo.height}</p>
                          <p className='profile-text'>Weight: {userInfo.weight}</p>
                      </div>
                    </div>
                    <div className="card-right"> 
                      <div className='background-card-right'>
                        {renderStatistics()}
                        {renderPosition()}
                      </div>  
                    </div>
                </main>
                {error && <div className="error">{error}</div>}
            </div>
        </div>
    );
}

export default Profile;
