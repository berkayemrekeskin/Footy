const Training = require("../models/Training");
const asyncHandler = require("express-async-handler");
const { physicalTraining, technicalTraining, tacticalTraining } = require("../constansts");
const mongoose = require("mongoose");

const createTraining = asyncHandler( async(req,res) => {

    const { type, effect, effect_value, description, duration } = req.body;
    console.log(type);

    if(physicalTraining.find(physical => physical.name === type) || technicalTraining.find(technical => technical.name === type) || tacticalTraining.find(tactical => tactical.name === type))
    {
        if(!duration || !description)
            res.status(400).json({ msg: "All fields are mandatory for ", type});
    }
    else {
        return res.status(400).json({ msg: "Invalid type"});
    }

    const training = new Training({
        user_id: req.user.id,
        type,
        effect,
        effect_value,
        description,
        duration,
    });

    try {
        await training.save();
        res.status(201).json(training);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const updateTraining = asyncHandler(async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
    }

    const training = await Training.findById(req.params.id);
    
    if (!training) {
        res.status(404);
        throw new Error("Training not found!");
    }
    if (training.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User doesn't have permission");
    }

    const updatedTraining = await Training.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTraining);
});

const deleteTraining = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
    }

    const training = await Training.findById(req.params.id);
    if (!training) {
        res.status(404);
        throw new Error("Training not found!");
    }
    if (training.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User doesn't have permission");
    }

    await Training.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Training deleted successfully" });
});

const getTraining = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
    }

    const training = await Training.findById(req.params.id);
    if (!training) {
        res.status(404);
        throw new Error("training not found!");
    }
    res.status(200).json(training);
});

const getAllTrainings = asyncHandler(async (req, res) => {
    const trainings = await Training.find({user_id: req.user.id});
    res.status(200).json(trainings);
});

module.exports = {
    createTraining,
    updateTraining,
    getTraining, 
    getAllTrainings,
    deleteTraining,
};