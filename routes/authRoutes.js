const express = require("express");
const { loginUser, registerUser } = require("../controllers/authController");
const { validateRegister, validateLogin } = require("../middleware/validateUser");

const router = express.Router();

router.post("/login", validateLogin, loginUser);
router.post("/register", validateRegister, registerUser);

module.exports = router;
