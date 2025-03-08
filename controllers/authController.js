// const User = require('../models/user')


// exports.login = async(req,res)=>{
//     console.log("Inside register Controller");
//     console.log(req.body);
//     try{
//         const {email,password} = req.body
//         const user = await user.findOne({email})
//         if(!user){
//             res.status(404).json("User Not Found...!!!")
//         }
//     }catch(err){
//         console.log(err);
//     }
// }

const User = require('../models/user');
const Employee = require('../models/employee'); // Add Employee model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.login = async (req, res) => {
    console.log("Login request received:", req.body);
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email }); // Check admin first
        let role;

        if (user) {
            role = "admin"; // Assign role correctly
        } else {
            user = await Employee.findOne({ email }); // Check employee collection
            if (user) {
                role = "employee"; // Assign role correctly
            }
        }

        console.log("User found:", user); // Debugging

        if (!user) {
            console.log("User not found in database");
            return res.status(404).json({ message: "User Not Found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password does not match");
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("Login successful, sending response", { token, role });

        res.status(200).json({ token, role, message: "Login Successful" });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};
