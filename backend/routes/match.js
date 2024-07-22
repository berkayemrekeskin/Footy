const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);
router.post("/create", authMiddleware, matchController.createMatch);
router.put("/update/:id", authMiddleware, matchController.updateMatch);
router.delete("/delete/:id", authMiddleware, matchController.deleteMatch);
router.get("/get/:id", authMiddleware, matchController.getMatch);
router.get("/get", authMiddleware, matchController.getAllMatches);

module.exports = router;