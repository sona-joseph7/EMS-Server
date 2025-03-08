require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user'); // Import the User model

// Connect to MongoDB
mongoose.connect(process.env.DBCONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Connected to MongoDB");

        // Check if an admin already exists
        const existingAdmin = await User.findOne({ email: "admin@ems.com" });
        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit();
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        // Create an admin user
        const adminUser = new User({
            name: "Admin",
            email: "admin@ems.com",
            password: hashedPassword,
            role: "admin",
            profileImage: "default_admin.jpg" // Placeholder image
        });

        await adminUser.save();
        console.log("Admin user created successfully!");
        process.exit();
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });
