import React, { useState, useEffect } from 'react';
import '../styles/CreateUserInfoForm.css';
import { createUserInfo, getPositions } from '../api/api';
import { useNavigate } from 'react-router-dom';

const UserInfoForm = () => {
    const [generalPosition, setGeneralPosition] = useState('');
    const [formData, setFormData] = useState({
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

    var positions = undefined;

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('token'));
                const response = await getPositions(token);
                const response_str = JSON.stringify(response);
                const posArr = JSON.parse(response_str);
                positions = posArr;
                console.log("Poss:" , posArr);
                console.log("Poss.Forward", posArr.forward);
                console.log("Poss.Forward.RW", posArr.forward.RW);

                console.log('Positions:', positions);

            } catch (error) {
                console.error('Error fetching positions:', error);
            }
        };
        fetchPositions();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGeneralPosition = (e) => {
        const { name, value } = e.target;
        if (name === 'generalPosition') {
            setGeneralPosition(value);
        }
    };

    const handleSpesificPosition = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Form data:', formData);
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await createUserInfo(formData, token);
            const infoId = response._id;
            localStorage.setItem('infoId', JSON.stringify(infoId));
            console.log('User info id:', infoId);
            console.log('User info created:', response);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating user info:', error);
        }
    };

    const renderSpecificPosition = (generalPosition) => {
        console.log("General Position:", generalPosition);
        console.log("Spesific Position:", formData.position);
        switch (generalPosition) {
            case 'Forward':
                return (
                    <div className='userInputContainer'>
                        <select className='positionSelection' id="spesificPosition" name="position" onChange={handleSpesificPosition} value={formData.position}>
                            <option className="option" value="">Select position</option>
                            <option className="option" value="Right Wing">Right Wing</option>
                            <option className="option" value="LW">Left Wing</option>
                            <option className="option" value="CF">Center Forward</option>
                        </select>
                        <input className='userInput' type="number" name="goals" value={formData.goals} onChange={handleChange} placeholder="Goals" />
                        <input className='userInput' type="number" name="assists" value={formData.assists} onChange={handleChange} placeholder="Assists" />
                        <input className='userInput' type="number" name="passes_tried" value={formData.passes_tried} onChange={handleChange} placeholder="Passes Tried" />
                        <input className='userInput' type="number" name="passes_complete" value={formData.passes_complete} onChange={handleChange} placeholder="Passes Complete" />
                        <input className='userInput' type="number" name="dribbles_tried" value={formData.dribbles_tried} onChange={handleChange} placeholder="Dribbles Tried" />
                        <input className='userInput' type="number" name="dribbles_complete" value={formData.dribbles_complete} onChange={handleChange} placeholder="Dribbles Complete" />
                        <input className='userInput' type="number" name="shots_tried" value={formData.shots_tried} onChange={handleChange} placeholder="Shots Tried" />
                        <input className='userInput' type="number" name="shots_complete" value={formData.shots_complete} onChange={handleChange} placeholder="Shots Complete" />
                    </div>

                );
            case 'Midfield':
                return (

                    <div className='userInputContainer'>
                        <select className='positionSelection' id="spesificPosition" name="position" onChange={handleSpesificPosition} value={formData.position}>
                            <option className="option" value="">Select position</option>
                            <option className="option" value="CM">Center Midfield</option>
                            <option className="option" value="RM">Right Midfield</option>
                            <option className="option" value="LM">Left Midfield</option>
                            <option className="option" value="CDM">Center Defensive Midfield</option>
                            <option className="option" value="CAM">Center Attacking Midfield</option>
                        </select>
                        <input className='userInput' type="number" name="goals" value={formData.goals} onChange={handleChange} placeholder="Goals" />
                        <input className='userInput' type="number" name="assists" value={formData.assists} onChange={handleChange} placeholder="Assists" />
                        <input className='userInput' type="number" name="passes_tried" value={formData.passes_tried} onChange={handleChange} placeholder="Passes Tried" />
                        <input className='userInput' type="number" name="passes_complete" value={formData.passes_complete} onChange={handleChange} placeholder="Passes Complete" />
                        <input className='userInput' type="number" name="dribbles_tried" value={formData.dribbles_tried} onChange={handleChange} placeholder="Dribbles Tried" />
                        <input className='userInput' type="number" name="dribbles_complete" value={formData.dribbles_complete} onChange={handleChange} placeholder="Dribbles Complete" />
                        <input className='userInput' type="number" name="shots_tried" value={formData.shots_tried} onChange={handleChange} placeholder="Shots Tried" />
                        <input className='userInput' type="number" name="shots_complete" value={formData.shots_complete} onChange={handleChange} placeholder="Shots Complete" />
                    </div>
                    
                );
            case 'Defense':
                return (

                    <div className='userInputContainer'>
                        <select className='positionSelection' id="spesificPosition" name="position" onChange={handleSpesificPosition} value={formData.position}>
                            <option className="option" value="">Select position</option>
                            <option className="option" value="RB">Right Back</option>
                            <option className="option" value="LB">Left Back</option>
                            <option className="option" value="CB">Center Back</option>
                        </select>
                        <input className='userInput' type="number" name="goals" value={formData.goals} onChange={handleChange} placeholder="Goals" />
                        <input className='userInput' type="number" name="assists" value={formData.assists} onChange={handleChange} placeholder="Assists" />
                        <input className='userInput' type="number" name="passes_tried" value={formData.passes_tried} onChange={handleChange} placeholder="Passes Tried" />
                        <input className='userInput' type="number" name="passes_complete" value={formData.passes_complete} onChange={handleChange} placeholder="Passes Complete" />
                        <input className='userInput' type="number" name="dribbles_tried" value={formData.dribbles_tried} onChange={handleChange} placeholder="Dribbles Tried" />
                        <input className='userInput' type="number" name="dribbles_complete" value={formData.dribbles_complete} onChange={handleChange} placeholder="Dribbles Complete" />
                        <input className='userInput' type="number" name="shots_tried" value={formData.shots_tried} onChange={handleChange} placeholder="Shots Tried" />
                        <input className='userInput' type="number" name="shots_complete" value={formData.shots_complete} onChange={handleChange} placeholder="Shots Complete" />
                    </div>
                    
                );
            case 'Goalkeeper':
                return (
                    <div className='userInputContainer'>
                        <select className='positionSelection' id="spesificPosition" name="position" onChange={handleSpesificPosition} value={formData.position}>      
                            <option className="option" value="">Select position</option>
                            <option className="option" value="GK">Goalkeeper</option>
                        </select>
                        <input className='userInput' type="number" name="saves" value={formData.saves} onChange={handleChange} placeholder="Saves" />
                        <input className='userInput' type="number" name="goals_conceded" value={formData.goals_conceded} onChange={handleChange} placeholder="Goals Conceded" />
                        <input className='userInput' type="number" name="passes_tried" value={formData.passes_tried} onChange={handleChange} placeholder="Passes Tried" />
                        <input className='userInput' type="number" name="passes_complete" value={formData.passes_complete} onChange={handleChange} placeholder="Passes Complete" />
                    </div>
                );
            default:
                return null;
        }
    }
    
    return (
        <div>
            <form onSubmit={handleSubmit}>
            <div className="userInfoForm">
                <select className="positionSelection"id="generalPosition" name="generalPosition" onChange={handleGeneralPosition} value={generalPosition}>
                    <option value="">Select general position</option>
                    <option value="Forward">Forward</option>
                    <option value="Midfield">Midfield</option>
                    <option value="Defense">Defense</option>
                    <option value="Goalkeeper">Goalkeeper</option>
                </select>
                {renderSpecificPosition(generalPosition)}
            <button className="submitButton" type="submit">Submit</button>
            </div>
            </form>
        </div>
    );
    
};

export default UserInfoForm;
