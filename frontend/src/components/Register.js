import React from "react";
import { registerUser } from "../api/api";
import "../styles/Register.css";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = React.useState({
        username: undefined,
        email: undefined,
        password: undefined,
    });

    const navigate = useNavigate();
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const registeredUser = await registerUser(formData);
        localStorage.setItem('username', JSON.stringify(registerUser.username));
        console.log("User registered:", registeredUser);
        navigate('/login');
        } catch (error) {
        console.error("Error registering user:", error);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="registerContainer">
                <div className="registerTitle">Create an account</div>
                <input
                    className="registerInput"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                />
                <input
                    className="registerInput"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                <input
                    className="registerInput"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                />
                <button className="registerButton" type="submit">Register</button>
                <div className="registerText">Already have an account? <a href="/login">Log in</a></div>
            </div>
        
        </form>
    );
}

export default Register;