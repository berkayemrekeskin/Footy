import React, { useState } from 'react';
import { loginUser } from '../api/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [formData, setFormData] = useState({
        email: undefined,
        password: undefined,
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { email, password } = formData;
            const response = await loginUser({ email, password });
            console.log('User logged in:', response);
            console.log('Token:', response.accessToken);
            console.log('User ID:', response.user.id);
            localStorage.setItem('token', JSON.stringify(response.accessToken));
            localStorage.setItem('userId', JSON.stringify(response.user.id));;
            localStorage.setItem('email', JSON.stringify(email));
            localStorage.setItem('name', JSON.stringify(response.user.name));
            localStorage.setItem('surname', JSON.stringify(response.user.surname));
            navigate('/user-info');
        } catch (error) {
            console.error('Error logging in user:', error);
            setError('Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
            />
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
            />
            <button type="submit">Login</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default Login;
