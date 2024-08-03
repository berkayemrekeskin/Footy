import React from "react";
import { useNavigate } from "react-router-dom";
import { createTraining, getAllTrainings, updateTraining, deleteTraining, getPhysicalTrainings, getTacticalTrainings, getTechnicalTrainings, getUserInfo, updateUserInfo } from "../api/api";
import "../styles/Trainings.css";
import { Circle } from 'rc-progress';
import physicalImg from '../img/physical.png';
import tacticalImg from '../img/tactical.png';
import technicalImg from '../img/technical.png';

const Training = () => {

  const [formData, setFormData] = React.useState({
      type: undefined,
      effect: undefined,
      effect_value: undefined, 
      description: undefined,
      duration: undefined,
      status: false,
  });
  const [trainings, setTrainings] = React.useState([]);
  const [trainingStatistic, setTrainingStatistic] = React.useState(0);
  const [physicalTrainings, setPhysicalTrainings] = React.useState([]);
  const [tacticalTrainings, setTacticalTrainings] = React.useState([]);
  const [technicalTrainings, setTechnicalTrainings] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
      const fetchData = async () => {
        try {
          const token = JSON.parse(localStorage.getItem('token'));
          const trainings = await getAllTrainings(token);
          setTrainings(trainings);

          const _physicalTrainings = await getPhysicalTrainings(token);
          setPhysicalTrainings(_physicalTrainings.physicalTraining);

          const _tacticalTrainings = await getTacticalTrainings(token);
          setTacticalTrainings(_tacticalTrainings.tacticalTraining);

          const _technicalTrainings = await getTechnicalTrainings(token);
          setTechnicalTrainings(_technicalTrainings.technicalTraining);
  
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }, []);

    React.useEffect(() => {
      let count = 0;
      for(let i = 0; i < trainings.length; i++)
        if(trainings[i].status === true)
          count++;

      setTrainingStatistic(count / trainings.length * 100);

      console.log("Effect value:", formData.effect_value);
      console.log("Effect:", formData.effect);
      console.log("phy tr::" , physicalTrainings);
      console.log("tac tr::" , tacticalTrainings);
      console.log("tec tr::" , technicalTrainings);

    }, []);

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const [PAC, SHO, PAS, DRI, DEF, PHY] = trainingPointCalculation();
        const token = JSON.parse(localStorage.getItem("token"));
        const userId = JSON.parse(localStorage.getItem('userId'));
        const infoId = JSON.parse(localStorage.getItem(`infoID${userId}`));
        const userInfo = await getUserInfo(infoId, token);
        console.log(userInfo);
        userInfo.pace += PAC;
        userInfo.shooting += SHO;
        userInfo.passing += PAS;
        userInfo.dribbling += DRI;
        userInfo.defending += DEF;
        userInfo.physical += PHY;
        updateUserInfo(infoId, userInfo, token);
        console.log(userInfo);
        const response = await createTraining(formData, token);
        console.log("Training created:", response);
        setTrainings([...trainings, response]);
      } catch (error) {
      console.error("Error creating training:", error);
      }
  };

  const handleStatusUpdate = async (trainingId) => {
      try {
        const token = JSON.parse(localStorage.getItem('token'));
        const response = await updateTraining(trainingId, { status: true }, token);
        console.log('Training status updated:', response);
        // Update the trainings state to mark the training as completed
        setTrainings((prevTrainings) => prevTrainings.map(training =>
          training._id === trainingId ? { ...training, status: true } : training
        ));
        setTrainingStatistic(prevStat => prevStat + (100 / trainings.length));
      } catch (error) {
        console.error('Error updating training status:', error);
      }
    };
  
  const handleRemoveTraining = async (trainingId) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await deleteTraining(trainingId, token);
      console.log('Training removed:', response);
      // Update the trainings state to remove the training
      setTrainings((prevTrainings) => prevTrainings.filter(training => training._id !== trainingId));
    } catch (error) {
      console.error('Error removing training:', error);
    }
  };

  function pointAlgorithm(pac, sho, pas, dri, def, phy) {
    console.log("points2:" , pac, sho, pas, dri, def, phy);
    let minutes = formData.duration;
    let PAC = parseFloat((pac * minutes * 0.05).toFixed(2));
    let SHO = parseFloat((sho * minutes * 0.05).toFixed(2));
    let PAS = parseFloat((pas * minutes * 0.05).toFixed(2));
    let DRI = parseFloat((dri * minutes * 0.05).toFixed(2));
    let DEF = parseFloat((def * minutes * 0.05).toFixed(2));
    let PHY = parseFloat((phy * minutes * 0.05).toFixed(2));
    return [PAC, SHO, PAS, DRI, DEF, PHY];
  }

  function addPoint(trainingType, i, pac, sho, pas, dri, def, phy)
  {

    console.log("points1:" , pac, sho, pas, dri, def, phy);
    switch(trainingType[i].effect)
    {
      case "PAC":
        pac += trainingType[i].effect_value;
        break;
      case "SHO":
        sho += trainingType[i].effect_value;
        break;
      case "PAS":
        pas += trainingType[i].effect_value;
        break;
      case "DRI":
        dri += trainingType[i].effect_value;
        break;
      case "DEF":
        def += trainingType[i].effect_value;
        break;
      case "PHY":
        phy += trainingType[i].effect_value;
        break;
    }
    console.log("points3:" , pac, sho, pas, dri, def, phy);

    return [pac, sho, pas, dri, def, phy];
  }

  const trainingPointCalculation = () => {
    if(physicalTrainings.length === 0 || tacticalTrainings.length === 0 || technicalTrainings.length === 0)
    {
      console.log("No training data from json");
      return 0;
    }
    else {
      let pac, sho, pas, dri, def, phy;
      pac = sho = pas = dri = def = phy = 0;
      let calculatedPoints = [];

      for(let i = 0; i < physicalTrainings.length; i++)
      {
        if(physicalTrainings[i].type === formData.type)
        {
          calculatedPoints = addPoint(physicalTrainings, i, pac, sho, pas, dri, def, phy);
          formData.effect = physicalTrainings[i].effect;
          console.log("effect:", formData.effect);
          break;
        }
      }

      for(let i = 0; i < technicalTrainings.length; i++)
      {
        if(technicalTrainings[i].type === formData.type)
        {
          calculatedPoints = addPoint(technicalTrainings, i, pac, sho, pas, dri, def, phy);
          formData.effect = technicalTrainings[i].effect;
          console.log("effect:", formData.effect);
          break;
        }
      }

      for(let i = 0; i < tacticalTrainings.length; i++)
      {
        if(tacticalTrainings[i].type === formData.type)
        {
          calculatedPoints = addPoint(tacticalTrainings, i, pac, sho, pas, dri, def, phy);
          formData.effect = tacticalTrainings[i].effect;
          console.log("effect:", formData.effect);
          break;
        }
      }

      console.log("points4:" , calculatedPoints);
      
      let point = pointAlgorithm(calculatedPoints[0], calculatedPoints[1], calculatedPoints[2], calculatedPoints[3], calculatedPoints[4], calculatedPoints[5]);
      formData.effect_value = point[0] + point[1] + point[2] + point[3] + point[4] + point[5];
      console.log("Effect value:", point);
      return point;
      
    }
  }

  function renderCreateTraining() {
    return (
        <div>
          <form  onSubmit={handleSubmit}>
            <div className="training-form">
              <label className="label">
              <input
                  className="training-input"
                  type="text"
                  name="type"
                  value={formData.type}
                  placeholder="Type"
                  onChange={handleChange}
                  />
              </label>
              <label className="label">
                  <input
                  className="training-input"
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  />
              </label>
              <label className="label">
                  <input
                  className="training-input"
                  type="text"
                  name="duration"
                  placeholder="Duration"
                  value={formData.duration}
                  onChange={handleChange}
                  />
              </label>
              <button className="training-create-button" type="submit">Create</button>
            </div>
          </form>
        </div>
    );
  }

  function isTrainingCompleted(training) {
    return training.status === true;
  }

  const renderStartButton = (training, trainingStartLink) => {
    if (!isTrainingCompleted(training)) {
      return <button className='training-start-button' onClick={() => navigate(trainingStartLink)}>Start</button>;
    }
    return null;
  };

  function renderTraining() {
    return trainings.slice(0,6).map(training => {
        var img;
        const trainingStartLink = `/training/${training._id}`;

        if(training.type === "Strength" || training.type === "Power" || training.type === "Endurance" || training.type === "Mobility" || training.type === "Stability" || training.type === "Recovery")
            img = <img className="training-img" src={physicalImg} alt='profile' />;
        else if(training.type === "Passing" || training.type === "Tackling" || training.type === "Positioning" || training.type === "Ball Control" || training.type === "Possesion" || training.type === "Finishing")
            img = <img className="training-img" src={technicalImg} alt='profile' />;
        else if(training.type === "Set Pieces" || training.type === "Formations" || training.type === "Attacking" || training.type === "Defensive")
            img = <img className="training-img" src={tacticalImg} alt='profile' />;
        return (
            <div key={training._id} className='inner-card-training'>
              <div className='training-image'>
                {img}
              </div>
              <div className="training-info">
                <div className='training-remove-button'>
                  <button className='training-remove-button' onClick={() => handleRemoveTraining(training._id)}>X</button>
                </div>
                <div className='training-title'>{training.type}</div>
                <div className='training-duration'>{training.duration} minutes</div>
                <div className='training-description'>{training.description}</div>
                <div className='training-date'>{training.date.substring(0, 10).split('-').reverse().join('/')}</div>
                <div className='training-start-button'>
                  {renderStartButton(training, trainingStartLink)}
                </div>
              </div>
              
            </div>
          );
    });
  }

  return (
    <>
      <body className="training-page"> 
          <header className="training-header">
            <p className='logo-title'>Footy.</p>
          </header>
          <sidebar className="training-sidebar">
              <button className='button' onClick={() => navigate('/dashboard')}> D </button>
              <button className='button' onClick={() => navigate('/training')}> T </button>
            <button className='button' onClick={() => navigate('/matches')}> M </button>
            <button className='button' onClick={() => navigate('/profile')}> P </button>
          </sidebar>
          <main className="training-main">
              <div className="create-training-card">
                  {renderCreateTraining()}
                  <div className="training-statistic">
                      <Circle
                          percent={trainingStatistic} 
                          strokeColor="#1c1f23"
                          strokeWidth={6}
                          trailWidth={6}
                      />
                  </div>
              </div>
              <div className="all-trainings-card">
                  {renderTraining()}
              </div>
          </main> 
      </body>
    </>
  );
}

export default Training;