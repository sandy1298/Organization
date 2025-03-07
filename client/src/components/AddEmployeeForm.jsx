import React, { useState } from 'react';
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createPostAsync, fetchPostsAsync, selectPostAddStatus } from '../features/post/PostSlice';
import { uploadImage } from '../features/post/PostApi';

const AddEmployeeForm = ({ show, handleClose, employees }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    dob: "",
    experience: "",
    reportingManager: "",
    image: null,
  });
  const [errors, setErrors] = useState({});

  // Function to validate form fields before submission
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Employee name is required";
    if (!formData.designation.trim()) newErrors.designation = "Designation is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.experience || formData.experience < 0) newErrors.experience = "Valid experience is required";
    if (employees && employees.length > 0 && !formData.reportingManager) newErrors.reportingManager = "Reporting manager is required";
    if (!formData.image) newErrors.image = "Profile image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   // Function to handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "experience" && (value < 0 || isNaN(value))) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        experience: "Experience cannot be negative",
      }));
      return;
    }
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Function to handle image selection and validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ["image/png", "image/jpg", "image/jpeg"];
    const maxSize = 1 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file format. Only PNG, JPG, and JPEG are allowed.");
      setErrors((prevErrors) => ({ ...prevErrors, image: "Invalid file format" }));
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size exceeds 1MB. Please upload a smaller image.");
      setErrors((prevErrors) => ({ ...prevErrors, image: "File size must be under 1MB" }));
      e.target.value = "";
      return;
    }

    setFormData((prevData) => ({ ...prevData, image: file }));
    setErrors((prevErrors) => ({ ...prevErrors, image: "" }));
  };

// Function to handle image upload
  const handleImageUpload = async () => {
    try {
      if (!formData.image) {
        toast.error("Please upload an image.");
        return null;
      }
      const url = await uploadImage(formData.image);
      return url;
    } catch (error) {
      toast.error("Image upload failed.");
      return null;
    }
  };

  const postAddStatus = useSelector(selectPostAddStatus);

  const handleCloseAndReset = () => {
    setFormData({
      name: "",
      designation: "",
      dob: "",
      experience: "",
      reportingManager: "",
      image: null,
    });
    setErrors({});
    handleClose(); // Close the modal
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (formData.experience < 0 || isNaN(formData.experience)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        experience: "Experience cannot be negative",
      }));
      toast.error("Please enter a valid experience value.");
      return;
    }
    try {
      const imageUrl = await handleImageUpload();
      if (imageUrl) {
        const employeeDetails = {
          name: formData.name,
          designation: formData.designation,
          dob: formData.dob,
          experience: formData.experience,
          reportingManager: formData.reportingManager,
          image: imageUrl
        };
        await dispatch(createPostAsync({ postDetails: employeeDetails }));
        await dispatch(fetchPostsAsync());
        toast.success("Employee added Successfully");
       
          handleClose();
          handleCloseAndReset()
      }
    } catch (error) {
      toast.error("Failed to add employee.");
    }
  };




  return (
    <Modal show={show} onHide={handleCloseAndReset} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Employee</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Profile Image *</Form.Label>
            <Form.Control
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              onChange={handleImageChange}
            />
            {errors.image && <small className="text-danger">{errors.image}</small>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Employee Name *</Form.Label>
            <Form.Control type="text" name="name" placeholder="Employee Name" onChange={handleInputChange} />
            {errors.name && <small className="text-danger">{errors.name}</small>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Designation *</Form.Label>
            <Form.Control type="text" name="designation" placeholder="Designation" onChange={handleInputChange} />
            {errors.designation && <small className="text-danger">{errors.designation}</small>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date of Birth *</Form.Label>
            <Form.Control
              type="date"
              name="dob"
              max={new Date().toISOString().split("T")[0]}
              onChange={handleInputChange}
            />
            {errors.dob && <small className="text-danger">{errors.dob}</small>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Years of Experience *</Form.Label>
            <Form.Control type="number" name="experience" placeholder="Years of Experience" onChange={handleInputChange} />
            {errors.experience && <small className="text-danger">{errors.experience}</small>}
          </Form.Group>

          {employees && employees.length > 0 && (
            <Form.Group className="mb-3">
              <Form.Label>Reporting Manager *</Form.Label>
              <Form.Select name="reportingManager" onChange={handleInputChange}>
                <option value="">Select Reporting Manager</option>
                {employees.map(manager => (
                  <option key={manager._id} value={manager._id}>{manager.name}</option>
                ))}
              </Form.Select>
              {errors.reportingManager && <small className="text-danger">{errors.reportingManager}</small>}
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className='buttons_align'>
            <button className='button_submit' disabled={postAddStatus === "pending"} type="submit">
              {postAddStatus === "pending" ? "Submitting..." : "Submit"}
            </button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEmployeeForm;
