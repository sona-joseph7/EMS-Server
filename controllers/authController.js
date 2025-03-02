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


const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.login = async (req, res) => {
    console.log("Inside login Controller");
    console.log(req.body);
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User Not Found...!!!" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }  // Token expires in 1 hour
        );

        res.status(200).json({ token, role: user.role, message: "Login Successful" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};
