const express = require("express");
const router = express.Router();
const trainingController = require("../controllers/trainingController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);
router.post("/create", authMiddleware, trainingController.createTraining);
router.put("/update/:id", authMiddleware, trainingController.updateTraining);
router.delete("/delete/:id", authMiddleware, trainingController.deleteTraining);
router.get("/get/:id", authMiddleware, trainingController.getTraining);
router.get("/get", authMiddleware, trainingController.getAllTrainings);

module.exports = router;