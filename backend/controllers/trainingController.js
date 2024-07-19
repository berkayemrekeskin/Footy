const Training = require("../models/Training");
const asyncHandler = require("express-async-handler");
const { physicalTraining, technicalTraining, tacticalTraining } = require("../constansts");
const mongoose = require("mongoose");


//@desc Create training
//@route POST /api/training/create
//@access private

const createTraining = asyncHandler( async(req,res) => {

    const { type, description, duration } = req.body;

    if(Object.values(physicalTraining).includes(type) || Object.values(technicalTraining).includes(type) || Object.values(tacticalTraining).includes(type))
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


//@desc Update training info
//@route PUT /api/training/update/:id
//@access private

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

//@desc Get training info
//@route GET /api/training/get/:id
//@access private

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


//@desc Get all trainings info
//@route GET /api/training/get
//@access private

const getAllTrainings = asyncHandler(async (req, res) => {
    const trainings = await Training.find({user_id: req.user.id});
    res.status(200).json(trainings);
});

module.exports = {
    createTraining,
    updateTraining,
    getTraining, 
    getAllTrainings,
};