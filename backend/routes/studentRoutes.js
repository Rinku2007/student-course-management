const express = require("express");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

const studentController = require("../controllers/studentController");

const router = express.Router();

router.get("/", auth, studentController.getStudents);
router.post("/", auth, upload.single("profileImage"), studentController.createStudent);
router.put("/:id", auth, upload.single("profileImage"), studentController.updateStudent);
router.delete("/:id", auth, studentController.deleteStudent);

module.exports = router;