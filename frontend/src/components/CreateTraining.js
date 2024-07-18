import React from "react";
import { createTraining } from "../api/api";
import { useNavigate } from "react-router-dom";

const CreateTraining = () => {
    const [formData, setFormData] = React.useState({
        type: undefined,
        duration: undefined,
        status: false,
    });
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const token = JSON.parse(localStorage.getItem("token"));
        const response = await createTraining(formData, token);
        console.log("Training created:", response);
        navigate("/dashboard");
        } catch (error) {
        console.error("Error creating training:", error);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Type"
        />
        <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duration"
        />
        <button type="submit">Create Training</button>
        </form>
    );
}

export default CreateTraining;