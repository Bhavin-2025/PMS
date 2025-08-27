import React, { useEffect, useState } from "react";
import InputField from "../components/InputField";
import api from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import SelectField from "../components/SelectField";
import DueDatePicker from "../components/DueDatePicker";

const AddTask = () => {
  const initialState = {
    taskName: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState(null);
  const [priority, setPriority] = useState(null);
  const [project, setProject] = useState(null);
  // console.log("project", rpoy);

  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [dueDate, setDueDate] = useState(null);

  const navigate = useNavigate();
  console.log("employeeOptions", employeeOptions);

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

  // Fetch projects + employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await api.get("/projects");
        const empRes = await api.get("/employees");

        const projects = projectRes.data;
        const employees = empRes.data;

        console.log("employees", employees);

        // prepare project options with employeeIds
        const mappedProjects = projects.map((proj) => ({
          label: proj.projectName,
          value: proj.id,
          employeeIds: proj.employees || [],
        }));

        setProjectOptions(mappedProjects);

        if (projectId) {
          const selectedProject = mappedProjects.find(
            (p) => p.value.toString() === projectId.toString()
          );
          // console.log("selectedProject", selectedProject);
          setProject(selectedProject || null);

          if (selectedProject) {
            const allowedEmployees = employees.filter((emp) =>
              selectedProject.employeeIds.includes(emp.id)
            );
            setEmployeeOptions(
              allowedEmployees.map((emp) => ({
                label: emp.name,
                value: emp.id,
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [projectId, project]);

  // const handleProjectChange = async (proj) => {
  //   // proj here will be the whole object { label, value, employeeIds }
  //   console.log("Selected Project:", proj);

  //   setProject(proj);
  //   setAssignedEmployees([]); // reset previously selected employees

  //   try {
  //     const empRes = await api.get("/employees");
  //     const employees = empRes.data;

  //     // Filter employees that belong to this project
  //     const allowedEmployees = employees.filter((emp) =>
  //       proj.employeeIds.includes(emp.id)
  //     );

  //     console.log("Allowed Employees:", allowedEmployees);

  //     setEmployeeOptions(
  //       allowedEmployees.map((emp) => ({
  //         label: emp.name,
  //         value: emp.id,
  //       }))
  //     );
  //   } catch (error) {
  //     console.error("Error fetching employees:", error);
  //   }
  // };

  const handleProjectChange = async (projId) => {
    try {
      const projRes = await api.get("/projects");
      const empRes = await api.get("/employees");

      const projectData = projRes.data; // all projects
      const employeesData = empRes.data; // all employees

      // find selected project
      const project = projectData.find((p) => p.id === projId);
      console.log(project, "selected project");
      setProject(project.projectName);
      if (!project) return;

      // match employees by id
      const allowedEmployees = employeesData.filter((emp) =>
        project.employees.includes(emp.id)
      );

      console.log(allowedEmployees, "allowedEmployees");

      setEmployeeOptions(
        allowedEmployees.map((emp) => ({
          label: emp.name,
          value: emp.id,
        }))
      );
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

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
      console.log("Task Created:", response.data);

      setFormData(initialState);
      setAssignedEmployees([]);
      setProject(null);
      setStatus(null);
      setPriority(null);
      navigate("/admin/project");
    } catch (error) {
      console.log("Error creating task", error);
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
            onChange={handleProjectChange}
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
            value={formData?.description}
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
            className="bg-[#F2F2F5] rounded-3xl px-4 py-3 font-bold text-sm cursor-pointer hover:bg-gray-200"
          >
            Clear
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
