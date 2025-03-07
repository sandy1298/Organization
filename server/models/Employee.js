const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  dob: { type: Date, required: true },
  experience: { type: Number, required: true },
  reportingManager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
  image: { type: String, required: true }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
