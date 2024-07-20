import React from "react";
import { createTraining } from "../api/api";
import { useNavigate } from "react-router-dom";

const CreateTraining = () => {
    const [formData, setFormData] = React.useState({
        type: undefined,
        description: undefined,
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
        <h1>Create Training</h1>
        <label>
            Type:
            <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            />
        </label>
        <label>
            Description:
            <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            />
        </label>
        <label>
            Duration:
            <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            />
        </label>
        <button type="submit">Create</button>
        </form>
    );
}

export default CreateTraining;