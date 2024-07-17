const express = require("express");
const router = express.Router();
const infoController = require("../controllers/infoController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);
router.post("/create", authMiddleware, infoController.setUserInfo);
router.put("/update/:id", authMiddleware, infoController.updateUserInfo);
router.get("/get/:id", authMiddleware, infoController.getUserInfo);

module.exports = router;