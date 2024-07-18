import React, { useState } from 'react';
import '../styles/UserInfoForm.css';
import { createUserInfo } from '../api/api';
import { useNavigate } from 'react-router-dom';

const UserInfoForm = () => {
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
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
    
    return (
        <form onSubmit={handleSubmit}>
            <input className='userInput' type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position" />
            {formData.position === 'Goalkeeper' ? (
                <>
                    <input className='userInput' type="number" name="saves" value={formData.saves} onChange={handleChange} placeholder="Saves" />
                    <input className='userInput' type="number" name="goals_conceded" value={formData.goals_conceded} onChange={handleChange} placeholder="Goals Conceded" />
                    <input className='userInput' type="number" name="passes_tried" value={formData.passes_tried} onChange={handleChange} placeholder="Passes Tried" />
                    <input className='userInput' type="number" name="passes_complete" value={formData.passes_complete} onChange={handleChange} placeholder="Passes Complete" />
                </>
            ) : (
                <>
                    <input className='userInput' type="number" name="goals" value={formData.goals} onChange={handleChange} placeholder="Goals" />
                    <input className='userInput' type="number" name="assists" value={formData.assists} onChange={handleChange} placeholder="Assists" />
                    <input className='userInput' type="number" name="passes_tried" value={formData.passes_tried} onChange={handleChange} placeholder="Passes Tried" />
                    <input className='userInput' type="number" name="passes_complete" value={formData.passes_complete} onChange={handleChange} placeholder="Passes Complete" />
                    <input className='userInput' type="number" name="dribbles_tried" value={formData.dribbles_tried} onChange={handleChange} placeholder="Dribbles Tried" />
                    <input className='userInput' type="number" name="dribbles_complete" value={formData.dribbles_complete} onChange={handleChange} placeholder="Dribbles Complete" />
                    <input className='userInput' type="number" name="shots_tried" value={formData.shots_tried} onChange={handleChange} placeholder="Shots Tried" />
                    <input className='userInput' type="number" name="shots_complete" value={formData.shots_complete} onChange={handleChange} placeholder="Shots Complete" />
                </>
            )}
            <button type="submit">Create Info</button>
        </form>
    );
};

export default UserInfoForm;
