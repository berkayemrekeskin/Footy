import React from "react";
import { registerUser } from "../api/api";
import "../styles/Register.css";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = React.useState({
        name: undefined,
        surname: undefined,
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
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                />
                <input
                    className="registerInput"
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder="Surname"
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
                <div className="registerText">Sign up to get access to all features</div>
                <div className="registerText">Already have an account? <a href="/login">Log in</a></div>
                <button className="registerButton" type="submit">Register</button>
            </div>
        
        </form>
    );
}

export default Register;