import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateUserInfoForm from './components/CreateUserInfoForm';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Trainings from './components/Trainings';
import StartTraining from './components/StartTraining';
import Matches from './components/Matches';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/user/info/create" element={<CreateUserInfoForm />} />
        <Route path="/training" element={<Trainings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/training/:id" element={<StartTraining />} />
        <Route path="/matches" element={<Matches />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// REGISTER +
// LOGIN +
// CREATE USER INFO +
// DASHBOARD +
// PROFILE 
// TRAINING
// MATCH
// HOME


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
