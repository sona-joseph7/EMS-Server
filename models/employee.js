const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { 
    type: String,
     required: true 
},
  email: { 
    type: String, 
    required: true, 
    unique: true 
},
  password: { 
    type: String, 
    required: true 
},
  role: {
     type: String, 
     enum: ["admin", "employee"], 
     required: true 
    },
  employeeId: { 
    type: String, 
    required: true, 
    unique: true 
},
  dob: { 
    type: String, 
    required: true
 },
  gender: { 
    type: String, 
    required: true
 },
  maritalStatus: {
     type: String, 
     required: true 
    },
  designation: {
     type: String,
      required: true 
    },
  department: { 
    type: String, 
    required: true 
},
  salary: {
     type: Number, 
     required: true
     },
  image: { 
    type: String, 
    default: "default.jpeg"
},
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
