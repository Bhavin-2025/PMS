import React, { useState } from "react";
import InputField from "../components/InputField";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AddEmployeePage = () => {
  const initialState = {
    name: "",
    email: "",
    department: "",
    role: "",
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🔹 POST request to JSON Server
      const response = await api.post(
        "/employees",
        formData
      );

      console.log("Employee added:", response.data);

      // 🔹 Reset form after successful submit
      setFormData(initialState);
      navigate("/admin");

      // Later we can also redirect to Employee List page here
      // navigate("/employees"); (when routing is ready)
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleCancel = () => {
    setFormData(initialState); // reset on cancel
  };

  const navigate = useNavigate();

  //    Helper function for button disableing
  const isFormValid =
    formData.name && formData.email && formData.department && formData.role;

  return (
    <div>
      <div className="container">
        <h3 className="mt-6 text-4xl font-bold">Add New Employee</h3>
        <form onSubmit={handleSubmit}>
          <div className="w-[448px] mt-4 flex flex-col gap-5">
            <InputField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter employee's full name"
            />
            <InputField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter employee's email address"
            />
            <InputField
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter employee's department"
            />
            <InputField
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Enter employee's role"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-[#F2F2F5] rounded-3xl px-4 py-3 font-bold text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`rounded-3xl px-4 py-3 font-bold text-sm cursor-pointer ${
                isFormValid
                  ? "bg-[#DBE8F2] text-black"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Add New Employee
            </button>
          </div>
        </form>
        {/* Action Buttons */}
      </div>
    </div>
  );
};

export default AddEmployeePage;
