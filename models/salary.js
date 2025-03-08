const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  basicSalary: {
    type: Number,
    required: true,
  },
  allowance: {
    type: Number,
    default: 0,
  },
  deduction: {
    type: Number,
    default: 0,
  },
  totalSalary: {
    type: Number,
    required: true,
  },
  payDate: {
    type: Date,
    required: true,
  },
});

const Salary = mongoose.model('Salary', salarySchema);
module.exports = Salary;
