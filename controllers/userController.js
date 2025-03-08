const bcrypt = require('bcryptjs');

const User = require('../models/user');  // Admin Collection
const Employee = require('../models/employee');  // Employee Collection 
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
    console.log("Login request received:", req.body);  // Log request data

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Missing credentials");  
            return res.status(400).json({ message: "Email and password required" });
        }

        // Check in User collection (for admin)
        let user = await User.findOne({ email });
        let role = "admin";

        // If not found, check in Employee collection (for employees)
        if (!user) {
            console.log("User not found in Admin collection. Checking Employee collection...");
            user = await Employee.findOne({ email });
            role = "employee";
        }

        if (!user) {
            console.log("User not found in both collections");  
            return res.status(404).json({ message: "User Not Found" });
        }

        console.log("User found:", user);  

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password does not match");  
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: role,name:user.name },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("Login successful, sending response");
        // res.status(200).json({ token, role, name:user.name, message: "Login Successful" });

          //  user details in the response
          const { name, employeeId, dob, gender, department, maritalStatus } = user;
          res.status(200).json({
              token,
              role,
              user: { name, employeeId, dob, gender, department, maritalStatus },
              message: "Login Successful"
          });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};
