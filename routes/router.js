const express = require('express')
const { login } = require('../controllers/authController')
const authenticate = require("../middleware/authMiddleware")

const router = new express.Router()

//login
router.post('/login',login)

// Protected Routes (Only accessible if logged in)
router.get('/admin-dashboard', authenticate, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access Denied. Admins Only." });
    }
    res.status(200).json({ message: "Welcome to Admin Dashboard" });
});

module.exports = router