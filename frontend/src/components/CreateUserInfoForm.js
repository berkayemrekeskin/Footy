import React, { useState, useEffect } from 'react';
import '../styles/CreateUserInfoForm.css';
import { createUserInfo, getPositions } from '../api/api';
import { useNavigate } from 'react-router-dom';

const UserInfoForm = () => {

    const [positions, setPositions] = useState(undefined);
    const [formData, setFormData] = useState({
        name: undefined,
        surname: undefined,
        age: undefined,
        height: undefined,
        weight: undefined,
        foot: undefined,
        position: undefined,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('token'));
                const response = await getPositions(token);
                const response_str = JSON.stringify(response);
                const posArr = JSON.parse(response_str);
                setPositions(posArr);
            } catch (error) {
                console.error('Error fetching positions:', error);
            }
        };
        fetchPositions();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Form data:', formData);
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await createUserInfo(formData, token);
            const userId = JSON.parse(localStorage.getItem('userId'));
            const infoId = response._id;
            localStorage.setItem(`infoID${userId}`, JSON.stringify(infoId));
            console.log('User info id:', infoId);
            console.log('User info created:', response);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating user info:', error);
        }
    };

    const renderPositions = () => {
        if (positions) {
            return (
                <select
                    name="position"
                    onChange={handleChange}
                    className='userInfoInput'
                >
                    {positions.positions.map((position) => {
                        return (
                            <option key={position.id} value={position.name}>
                                {position.name}
                            </option>
                        );
                    })}
                </select>
            );
        }
        else {
            return (
                <div> Loading... </div>
            );
        }
    }

    return (
        <div>
            <body className="userInfoBody">
                <form onSubmit={handleSubmit}>
                <div className="userInfoForm">
                    <div className="userInfoTitle">User Info</div>
                    <input
                        className='userInfoInput'
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                    />
                    <input
                        className='userInfoInput'
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        placeholder="Surname"
                    />
                    <input
                        className='userInfoInput'
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Age"
                    />
                    <input
                        className='userInfoInput'
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        placeholder="Height"
                    />
                    <input
                        className='userInfoInput'
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="Weight"
                    />
                    <input
                        className='userInfoInput'
                        type="text"
                        name="foot"
                        value={formData.foot}
                        onChange={handleChange}
                        placeholder="Foot"
                    />
                    {renderPositions()}
                    
                <button className="submitButton" type="submit">Submit</button>
                </div>
                </form>
            </body>
        </div>
    );
    
};

export default UserInfoForm;
