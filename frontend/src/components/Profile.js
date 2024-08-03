import React from 'react';
import { getUserInfo, updateUserInfo} from '../api/api';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import { Circle } from 'rc-progress';

const Profile = () => {
    const [userInfo, setUserInfo] = React.useState(null);
    const [name, setName] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem('userId'));
                const infoId = JSON.parse(localStorage.getItem(`infoID${userId}`));
                const token = JSON.parse(localStorage.getItem('token'));
                const userInfo = await getUserInfo(infoId, token);
                setName(userInfo.name);
                setSurname(userInfo.surname);

                setUserInfo(userInfo);
                console.log('userInfo:', userInfo);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message || JSON.stringify(error));
            }
        };
        fetchData();
    }, []);


  function renderStatistics() {
      if(userInfo.position === 'Goalkeeper') 
      {
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
                  percent={userInfo.pace} 
                  strokeColor="#1c1f23"
                  strokeWidth={6}
                  trailWidth={6}
                />
                <div className='stat-name'>Pace</div>
                </div>
              <div className='statistic-pf'>
                <Circle
                  percent={userInfo.shooting} 
                  strokeColor="#1c1f23"
                  strokeWidth={6}
                  trailWidth={6}
                />
                <div className='stat-name'>Shooting</div>
                </div>
                <div className='statistic-pf'>
                  <Circle
                    percent={userInfo.passing} 
                    strokeColor="#1c1f23"
                    strokeWidth={6}
                    trailWidth={6}
                  />
                  <div className='stat-name'>Passing</div>

              </div>
              <div className='statistic-pf'>
                  <Circle
                    percent={userInfo.dribbling} 
                    strokeColor="#1c1f23"
                    strokeWidth={6}
                    trailWidth={6}
                  />
                  <div className='stat-name'>Dribbling</div>

              </div>
              <div className='statistic-pf'>
                  <Circle
                    percent={userInfo.defending} 
                    strokeColor="#1c1f23"
                    strokeWidth={6}
                    trailWidth={6}
                  />
                  <div className='stat-name'>Defending</div>

              </div>
              <div className='statistic-pf'>
                  <Circle
                    percent={userInfo.physical} 
                    strokeColor="#1c1f23"
                    strokeWidth={6}
                    trailWidth={6}
                  />
                  <div className='stat-name'>Physical</div>

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
                    <button className='button' onClick={() => navigate('/matches')}> M </button>
                    <button className='button' onClick={() => navigate('/profile')}> P </button>
                </section>
                <main className='profile-main'> 
                    <div className="card-left">
                      <div className="background-card-left">
                        <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" className='profile-avatar' />
                          <p className='profile-text'><b>{name} {surname}</b></p>
                          <p className='profile-text'>Position: {userInfo.position}</p>
                          <p className='profile-text'>Age: {userInfo.age}</p>
                          <p className='profile-text'>Height: {userInfo.height}</p>
                          <p className='profile-text'>Weight: {userInfo.weight}</p>
                      </div>
                    </div>
                    <div className="card-right"> 
                      <div className='background-card-right'>
                        {renderStatistics()}
                      </div>  
                    </div>
                </main>
                {error && <div className="error">{error}</div>}
            </div>
        </div>
    );
}

export default Profile;
