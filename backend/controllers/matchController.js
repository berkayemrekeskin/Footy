const Match = require("../models/Match");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const createMatch = asyncHandler( async(req,res) => {

    const { position, minutes_played, goals_scored, assists, yellow_card, red_card, total_shots, shots_on_target, total_passes,
        passes_completed, total_dribbles, dribbles_completed, total_tackles, tackles_completed, saves, goals_conceded } = req.body;

    if (position === "Goalkeeper") {
        if (
            saves === undefined || goals_conceded === undefined || minutes_played === undefined || yellow_card === undefined ||
            red_card === undefined || total_passes === undefined || passes_completed === undefined
        ) {
            return res.status(400).json({ msg: "All fields are mandatory for Goalkeeper" });
        }
    } else {
        if (
            minutes_played === undefined || yellow_card === undefined || red_card === undefined || total_shots === undefined ||
            shots_on_target === undefined || total_passes === undefined || passes_completed === undefined || total_dribbles === undefined ||
            dribbles_completed === undefined || total_tackles === undefined || tackles_completed === undefined ||
            goals_scored === undefined || assists === undefined
        ) {
            return res.status(400).json({ msg: `All fields are mandatory for ${position}` });
        }
    }

    const match = new Match({
        user_id: req.user.id,
        position,
        minutes_played,
        goals_scored,
        assists,
        yellow_card,
        red_card,
        total_shots,
        shots_on_target,
        total_passes,
        passes_completed,
        total_dribbles,
        dribbles_completed,
        total_tackles,
        tackles_completed,
        saves,
        goals_conceded,
    });

    try {
        await match.save();
        res.status(201).json(match);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const updateMatch = asyncHandler(async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
    }

    const match = await Match.findById(req.params.id);
    
    if (!match) {
        res.status(404);
        throw new Error("match not found!");
    }
    if (match.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User doesn't have permission");
    }

    const updatedMatch = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedMatch);
});

const deleteMatch = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
    }

    const match = await Match.findById(req.params.id);
    if (!match) {
        res.status(404);
        throw new Error("match not found!");
    }
    if (match.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User doesn't have permission");
    }

    await Match.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "match deleted successfully" });
});

const getMatch = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
    }

    const match = await Match.findById(req.params.id);
    if (!match) {
        res.status(404);
        throw new Error("match not found!");
    }
    res.status(200).json(match);
});

const getAllMatches = asyncHandler(async (req, res) => {
    const matches = await Match.find({user_id: req.user.id});
    res.status(200).json(matches);
});

module.exports = {
    createMatch,
    updateMatch,
    getMatch, 
    getAllMatches,
    deleteMatch,
};