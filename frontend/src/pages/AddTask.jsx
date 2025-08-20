import React, { useEffect, useState } from "react";
import InputField from "../components/InputField";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import SelectField from "../components/SelectField";
import DueDatePicker from "../components/DueDatePicker";

const AddTask = () => {
  const initialState = {
    projectName: "",
    description: "",
  };
  const [selected, setSelected] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await api.get("/employees");
      const mapped = res.data.map((emp) => ({
        label: emp.name,
        value: emp.id,
      }));
      setEmployeeOptions(mapped);
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, employees: selected };

    try {
      const response = await api.post("/projects", payload);
      console.log("Project Created:", response.data);

      setFormData(initialState);
      setSelected([]);
      navigate("/admin/project");
    } catch (error) {
      console.log("Error creating project", error);
    }
  };

  const navigate = useNavigate();

  const handleCancel = () => {
    setFormData(initialState);
  };
  const isFormValid = formData.projectName && formData.description;
  return (
    <div className="container">
      <h3 className="font-bold text-3xl mt-6">Add New Task</h3>
      <form className="flex flex-col mt-5 gap-5" onSubmit={handleSubmit}>
        <InputField
          name="projectName"
          label="Task Name"
          placeholder="Enter Task name"
          value={formData.projectName}
          onChange={handleChange}
        />
        <div className="flex flex-col w-[450px] gap-1">
          <label className="font-medium text-base">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl p-4 h-[144px]"
          ></textarea>
        </div>

        <div className="flex flex-col w-[450px] gap-1">
          <label className="font-medium text-base">Assign Employee</label>
          <SelectField
            options={employeeOptions}
            value={selected}
            onChange={setSelected}
            placeholder="Select employee"
          />
        </div>
        <div className="flex flex-col w-[450px] gap-1">
          <label className="font-medium text-base">Status</label>
          <SelectField
            options={employeeOptions}
            value={selected}
            onChange={setSelected}
            placeholder="Select Status"
          />
        </div>
        <div className="flex flex-col w-[450px] gap-1">
          <label className="font-medium text-base">Priority</label>
          <SelectField
            options={employeeOptions}
            value={selected}
            onChange={setSelected}
            placeholder="Priority"
          />
        </div>
        <div className="flex flex-col w-[450px] gap-1">
          <label className="font-medium text-base">Due Date</label>
          <DueDatePicker />
        </div>
        <div className="flex justify-end space-x-3 mt-2">
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
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
