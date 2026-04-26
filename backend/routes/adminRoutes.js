const express = require("express");
const auth = require("../middleware/auth");
const { getProfile, updateProfile } = require("../controllers/adminController");

const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

module.exports = router;
