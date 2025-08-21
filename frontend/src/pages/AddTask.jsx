import React, { useEffect, useState } from "react";
import InputField from "../components/InputField";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import SelectField from "../components/SelectField";
import DueDatePicker from "../components/DueDatePicker";
import { useLocation } from "react-router-dom";

const AddTask = () => {
  const initialState = {
    taskName: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState(null);
  const [priority, setPriority] = useState(null);
  const [project, setProject] = useState(null);
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [dueDate, setDueDate] = useState(null);

  const navigate = useNavigate();

  const statusOptions = [
    { label: "Not Started", value: "Not Started" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
  ];

  const priorityOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ];

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get("projectId");
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        const mapped = res.data.map((emp) => ({
          label: emp.projectName,
          value: emp.id,
        }));
        setProjectOptions(mapped);
        if (projectId) {
          const selectedProject = mapped.find(
            (p) => p.value.toString() === projectId.toString()
          );
          setProject(selectedProject || null);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchProjects();
  }, [projectId]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees");
        const mapped = res.data.map((emp) => ({
          label: emp.name,
          value: emp.id,
        }));
        setEmployeeOptions(mapped);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      employees:
        assignedEmployees && assignedEmployees.length > 0
          ? assignedEmployees
          : [],
      status: status?.value || status || "",
      priority: priority?.value || priority || "",
      projectId: project?.value || project,
      dueDate,
    };

    try {
      const response = await api.post("/tasks", payload);
      console.log("Project Created:", response.data);

      setFormData(initialState);
      setAssignedEmployees([]);
      setProject(null);
      setStatus(null);
      setPriority(null);
      navigate("/admin/project");
    } catch (error) {
      console.log("Error creating project", error);
    }
  };

  const handleCancel = () => {
    setFormData(initialState);
    setAssignedEmployees([]);
    setProject(null);
    setStatus(null);
    setPriority(null);
    setDueDate(null);
  };

  const isFormValid =
    formData.taskName.trim() &&
    formData.description.trim() &&
    project &&
    assignedEmployees.length > 0 &&
    status &&
    priority &&
    dueDate;

  return (
    <div className="container">
      <h3 className="font-bold text-3xl mt-6">Add New Task</h3>
      <form className="flex flex-col mt-5 gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col w-[450px] gap-1">
          <label className="font-medium text-base">Project Name</label>
          <SelectField
            options={projectOptions}
            value={project}
            onChange={setProject}
            placeholder="Select Project"
            className="custom-select"
          />
        </div>

        <InputField
          name="taskName"
          label="Task Name"
          placeholder="Enter Task name"
          value={formData.taskName}
          onChange={handleChange}
        />

        <div className="flex flex-col w-[450px] gap-1">
          <label className="font-medium text-base">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl p-4 h-[144px]"
          />
        </div>

        <div className="flex flex-col w-[450px] gap-1">
          <label className="font-medium text-base">Assign Employee</label>
          <SelectField
            mode="multiple"
            options={employeeOptions}
            value={assignedEmployees}
            onChange={setAssignedEmployees}
            placeholder="Select employee(s)"
          />
        </div>

        <div className="flex flex-col w-[450px] gap-1">
          <label className="font-medium text-base">Status</label>
          <SelectField
            options={statusOptions}
            value={status}
            onChange={setStatus}
            placeholder="Select Status"
          />
        </div>

        <div className="flex flex-col w-[450px] gap-1">
          <label className="font-medium text-base">Priority</label>
          <SelectField
            options={priorityOptions}
            value={priority}
            onChange={setPriority}
            placeholder="Select Priority"
          />
        </div>

        <div className="flex flex-col w-[450px] gap-1">
          <label className="font-medium text-base">Due Date</label>
          <DueDatePicker value={dueDate} onChange={setDueDate} />
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
            className={`rounded-3xl px-4 py-3 font-bold text-sm ${
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
