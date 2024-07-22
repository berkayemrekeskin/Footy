const Info = require("../models/Info");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { use } = require("../routes/info");

const createUserInfo = asyncHandler( async(req,res) => {
    const {name, surname, age, weight, height, foot, position} = req.body;
    if(!name || !surname || !age || !weight || !height || !foot || !position)
    {
        res.status(400);
        throw new Error("All fields are mandatory");
    } 
    else 
    {
        const info = await Info.create({
            user_id: req.user.id,
            name,
            surname,
            age,
            weight,
            height,
            foot,
            position,
        });
        res.status(201).json(info);
    }
});

const updateUserInfo = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
    }
    const info = await Info.findById(req.params.id);
    if (!info) {
        res.status(404);
        throw new Error("Info not found!");
    }
    if (info.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User doesn't have permission");
    }
    const updatedInfo = await Info.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedInfo);
});

const getUserInfo = asyncHandler(async (req, res) => {
    console.log(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
    }
    const info = await Info.findById(req.params.id);
    if (!info) {
        res.status(404);
        throw new Error("Info not found!");
    }
    res.status(200).json(info);
});

module.exports = {
    createUserInfo,
    updateUserInfo,
    getUserInfo, 
};