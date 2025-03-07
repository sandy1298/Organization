const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();

// Fetch all employees from the database and populate the 'reportingManager' field
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().populate('reportingManager');
    res.json({posts : employees });
  } catch (error) {
    res.status(500).json({ error: "Error fetching employees" });
  }
});

// Add a new employee
router.post('/', async (req, res) => {
  try {
    const { name, designation, dob, experience, reportingManager, image } = req.body;
    if (!name || !designation || !dob || !experience || !image) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    const newEmployee = new Employee({
      name,
      designation,
      dob,
      experience,
      reportingManager: reportingManager || null,
      image
    });
    await newEmployee.save();
    res.status(201).json({ message: "Employee added successfully", newEmployee });
  } catch (error) {
    res.status(500).json({ error: "Error adding employee" });
  }
});

module.exports = router;
