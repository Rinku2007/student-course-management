const express = require("express");
const auth = require("../middleware/auth");
const { getCourses, createCourse, deleteCourse } = require("../controllers/courseController");

const router = express.Router();

router.get("/", auth, getCourses);
router.post("/", auth, createCourse);
router.delete("/:id", auth, deleteCourse);

module.exports = router;
