import React from "react";
import { useNavigate } from "react-router-dom";
import { createTraining, getAllTrainings, updateTraining, deleteTraining } from "../api/api";
import "../styles/Trainings.css";
import { Circle } from 'rc-progress';

const Training = () => {

    const [formData, setFormData] = React.useState({
        type: undefined,
        description: undefined,
        duration: undefined,
        status: false,
    });
    const [trainings, setTrainings] = React.useState([]);
    const [trainingStatistic, setTrainingStatistic] = React.useState(0);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchData = async () => {
          try {
            const token = JSON.parse(localStorage.getItem('token'));
            const trainings = await getAllTrainings(token);
            setTrainings(trainings);
    
            console.log('trainings:', trainings);
    
            let count = 0;
            for(let i = 0; i < trainings.length; i++)
              if(trainings[i].status === true)
                count++;

            setTrainingStatistic(count / trainings.length * 100);
    
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        fetchData();
      }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const token = JSON.parse(localStorage.getItem("token"));
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

    function renderTraining() {
        return trainings.slice(0,6).map(training => {
            return (
              <div key={training._id} className='training-card'>
                <div className='training-image'>image</div>
                <div className='training-remove-button'>
                  <button className='training-remove-button' onClick={() => handleRemoveTraining(training._id)}>Remove</button>
                </div>
                <div className='training-title'>{training.type}</div>
                <div className='training-duration'>{training.duration} minutes</div>
                <div className='training-description'>{training.description}</div>
                <div className='training-date'>{training.time.substring(0, 10).split('-').reverse().join('/')}</div>
                <div className='training-complete-button'>
                  <button className='training-complete-button' onClick={() => handleStatusUpdate(training._id)}>Complete</button>
                </div>
              </div>
            );
        });
      }

    return (
        <>
            <body className="training-page"> 
                <header className="training-header">
                </header>
                <sidebar className="training-sidebar">
                    <button className='button' onClick={() => navigate('/dashboard')}> D </button>
                    <button className='button' onClick={() => navigate('/training')}> T </button>
                    <button className='button' onClick={() => navigate('/nutritions')}> N </button>
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