const express = require('express')

const { login } = require('../controllers/authController')
const authenticate = require("../middleware/authMiddleware")
const Employee = require('../models/employee')
const Department = require('../models/department')
const Leave = require('../models/leave')
const Salary = require('../models/salary')
const Reward = require('../models/reward')
const userController = require('../controllers/userController'); 
const bcrypt = require("bcryptjs")
const multer = require("multer")
const path = require("path")
const { log } = require('console')
const router = new express.Router()

// Login route
router.post('/auth/login', userController.loginUser);


// router.post('/auth/login', async (req, res) => {
//     try {
//         console.log("Login request received", req.body); // Debugging
//         const { email, password } = req.body;

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ error: "User not found" });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(400).json({ error: "Invalid credentials" });
//         }

//         res.status(200).json({ message: "Login successful", user });
//     } catch (error) {
//         console.error("Login Error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });





// Add Employee API
router.post("/employee", async (req, res) => {
    try {
      const { name, email, password, role, ...rest } = req.body;
  
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newEmployee = new Employee({ name, email, password: hashedPassword, role, ...rest });
      await newEmployee.save();
      res.status(201).json({ message: "Employee added successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Fetch All Employees API
  router.get("/employee", async (req, res) => {
    try {
      const employees = await Employee.find().select("-password"); // Exclude passwords
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })


// Add a new department
router.post("/departments", async (req, res) => {
  try {
    const { name } = req.body;
    const newDepartment = new Department({ name });
    await newDepartment.save();
    res.status(201).json({ message: "Department added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding department", error });
  }
});

// Get all departments
router.get("/departments", async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments", error });
  }
});

// Delete a department
router.delete("/departments/:id", async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting department", error });
  }
});


// Get total department count
// router.get("/count", async (req, res) => {
//   try {
//     const count = await Department.countDocuments();
//     res.status(200).json({ count });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching department count", error });
//   }
// });

// Get total number of employees
router.get("/employees/count", async (req, res) => {
  try {
    const count = await Employee.countDocuments(); 
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching employee count:", error);
    res.status(500).json({ message: "Error fetching employee count", error });
  }
});

// Get total number of departments
router.get("/departments/count", async (req, res) => {
  try {
    const count = await Department.countDocuments(); 
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching department count:", error);
    res.status(500).json({ message: "Error fetching department count", error });
  }
});



// Secure Employee APIs
router.post("/employee", authenticate, async (req, res) => {
  try {
    const { name, email, password, role, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployee = new Employee({ name, email, password: hashedPassword, role, ...rest });
    await newEmployee.save();
    res.status(201).json({ message: "Employee added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/employee", authenticate, async (req, res) => {
  try {
    const employees = await Employee.find().select("-password");
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Secure Department APIs
router.post("/departments", authenticate, async (req, res) => {
  try {
    const { name } = req.body;
    const newDepartment = new Department({ name });
    await newDepartment.save();
    res.status(201).json({ message: "Department added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding department", error });
  }
});

router.get("/departments", authenticate, async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments", error });
  }
});





// Employee: Submit Leave Request
router.post('/employee/leaves', async (req, res) => {
  try {
    console.log("Leave Request Received:", req.body);

    const { employeeId, name, department, leaveType, startDate, endDate, reason } = req.body;

    
    if (!employeeId || !name || !department || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({ error: "End date cannot be before start date!" });
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const leave = new Leave({
      employeeId,
      name,
      department,
      leaveType,
      startDate,
      endDate,
      reason,
      days, 
      status: "Pending",
    });

    await leave.save();
    res.status(201).json({ message: "Leave Request Submitted", leave });

  } catch (error) {
    console.error("Error adding leave:", error);
    res.status(500).json({ error: "Error adding leave", details: error.message });
  }
});


// Employee: Get Leaves
router.get('/employee/leaves/:employeeId', async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.params.employeeId });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching leaves' });
  }
});

// Admin: Get All Leave Requests
router.get('/admin/leaves', async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching leaves' });
  }
});

// Admin: Update Leave Status
router.put('/admin/leaves/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({ error: 'Error updating leave' });
  }
});



//for salary
// Get employees based on department
router.get('/employees/:department', async (req, res) => {
  try {
    const employees = await Employee.find({ department: req.params.department });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching employees' });
  }
});

// Add salary for an employee
router.post('/salary', async (req, res) => {
  try {
    const { employeeId, name, department, basicSalary, allowance, deduction, payDate } = req.body;

    console.log("Received Salary Data:", req.body); // Log received data

    if (!employeeId || !name || !department || !basicSalary || !payDate) {
      return res.status(400).json({ error: 'All fields are required!' });
    }

    const totalSalary = Number(basicSalary) + Number(allowance || 0) - Number(deduction || 0);

    const salary = new Salary({
      employeeId: String(employeeId), // Ensure it's stored as a string
      name,
      department,
      basicSalary: Number(basicSalary),
      allowance: Number(allowance) || 0,
      deduction: Number(deduction) || 0,
      totalSalary,
      payDate: new Date(payDate),
    });

    await salary.save();
    console.log("Salary Saved in DB:", salary);

    res.status(201).json({ message: 'Salary added successfully', salary });
  } catch (error) {
    console.error("Error adding salary:", error);
    res.status(500).json({ error: 'Error adding salary', details: error.message });
  }
});



// Get salary history for an employee
// router.get('/salary/:employeeId', async (req, res) => {
//   try {
//     console.log("Fetching Salary for Employee:", req.params.employeeId);
//     const salaries = await Salary.find({ employeeId: req.params.employeeId });

//     console.log("Salary Data Found:", salaries); // Debugging log
//     res.status(200).json(salaries);
//   } catch (error) {
//     console.error("Error fetching salary history:", error);
//     res.status(500).json({ error: 'Error fetching salary history' });
//   }
// });
// Get salary history for an employee
router.get('/salary/:employeeId', async (req, res) => {
  try {
    console.log(`Querying salary for Employee ID: ${req.params.employeeId}`);
    
    // Ensure we are searching by employeeId (not _id)
    const salaries = await Salary.find({ employeeId: req.params.employeeId });

    console.log("Salary Data Found:", salaries);
    res.status(200).json(salaries);
  } catch (error) {
    console.error("Error fetching salary history:", error);
    res.status(500).json({ error: 'Error fetching salary history' });
  }
});



// router.get('/salary/:employeeId', async (req, res) => {
//   try {
//     const salaries = await Salary.find({ employeeId: req.params.employeeId });
//     res.status(200).json(salaries);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching salary history' });
//   }
// });

// Get all salary records (for admin)
// router.get('/salary', async (req, res) => {
//   try {
//     const salaries = await Salary.find();
//     res.status(200).json(salaries);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching salary records' });
//   }
// });
router.get("/admin/salaries", async (req, res) => {
  try {
    const salaries = await Salary.find();
    res.status(200).json(salaries);
  } catch (error) {
    res.status(500).json({ error: "Error fetching salaries" });
  }
});


// Assign Reward (Admin)
router.post("/admin/rewards", async (req, res) => {
  try {
    const { employeeId, reward } = req.body;

    if (!employeeId || !reward) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newReward = new Reward({
      employeeId,
      reward,
    });

    await newReward.save();
    res.status(201).json({ message: "Reward assigned successfully!", newReward });
  } catch (error) {
    res.status(500).json({ error: "Error assigning reward", details: error.message });
  }
});

// Get Rewards for Employee
router.get("/employee/rewards/:employeeId", async (req, res) => {
  try {
    const rewards = await Reward.find({ employeeId: req.params.employeeId });
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ error: "Error fetching rewards" });
  }
});

//for adding reward--
router.get("/employees", async (req, res) => {
  try {
      const employees = await Employee.find().select("-password"); 
      res.status(200).json(employees);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Delete an employee
router.delete("/employee/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
});


module.exports = router