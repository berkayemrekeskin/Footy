const Info = require("../models/Info");
const asyncHandler = require("express-async-handler");
const { forward, midfield, defense, goalkeeper } = require("../constansts");
const mongoose = require("mongoose");
const { use } = require("../routes/info");

//@desc Set user info
//@route POST /api/info/:id/set
//@access private

const setUserInfo = asyncHandler( async(req,res) => {

    const { position, goals, assists, saves, goals_conceded , dribbles_tried, dribbles_complete, passes_tried, passes_complete, shots_tried, shots_complete } = req.body;

    if(Object.values(forward).includes(position) || Object.values(midfield).includes(position) || Object.values(defense).includes(position))
    {
        if(!goals || !assists || !dribbles_tried || !dribbles_complete || !passes_tried || !passes_complete || !shots_tried || !shots_complete)
            res.status(400).json({ msg: "All fields are mandatory for ", position});
    }
    else if(Object.values(goalkeeper).includes(position))
    {
        if(!saves || !goals_conceded || !passes_tried || !passes_complete)
            res.status(400).json({ msg: "All fields are mandatory for ", position});
    }
    else {
        return res.status(400).json({ msg: "Invalid position"});
    }

    const info = new Info({
        user_id: req.user.id,
        user_name: req.user.name,
        user_surname: req.user.surname,
        user_email: req.user.email,
        position,
        goals,
        assists,
        saves,
        goals_conceded,
        dribbles_tried,
        dribbles_complete,
        passes_tried,
        passes_complete,
        shots_tried,
        shots_complete,
    });

    try {
        await info.save();
        res.status(201).json(info);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


//@desc Update user info
//@route PUT /api/info/:id/update
//@access private

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

//@desc Get user info
//@route GET /api/info/:id
//@access private

const getUserInfo = asyncHandler(async (req, res) => {
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
    setUserInfo,
    updateUserInfo,
    getUserInfo, 
};