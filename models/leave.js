const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: {
     type: String, 
     required: true 
    },
  name: { 
    type: String, 
    required: true
    },
  department: {
     type: String, 
     required: true 
    },
  leaveType: { 
    type: String, 
    required: true 
},
  startDate: {
     type: Date, 
     required: true 
    },
  endDate: {
     type: Date, 
     required: true 
    },
  days: { 
    type: Number, 
    required: true 
},
  reason: {
     type: String, 
     required: true 
    },
  status: {
     type: String, 
     enum: ['Pending', 'Approved', 'Rejected'], 
     default: 'Pending' 
    },
});

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;
