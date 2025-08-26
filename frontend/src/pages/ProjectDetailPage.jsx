import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Button, Dropdown, Popconfirm, message } from "antd";

const statusOptions = ["Not Started", "In Progress", "Completed"];

const ProjectDetailPage = () => {
  const Project_columns = [
    { key: "tasks", header: "Tasks" },
    { key: "employees", header: "Assignee" },
    { key: "dueDate", header: "Due Date" },
    { key: "status", header: "Status" },
  ];

  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [unsavedTasks, setUnsavedTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const [projectRes, taskRes, employeeRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get("/tasks"),
          api.get("/employees"),
        ]);

        const projectData = projectRes.data;
        const projectTasks = taskRes.data.filter(
          (t) => t.projectId === projectData.id
        );

        if (user?.role === "employee") {
          const isAssigned = projectTasks.some((t) =>
            (t.employees || []).includes(user.id)
          );
          if (!isAssigned) {
            message.error("You are not assigned to this project");
            navigate("/employee/project");
            return;
          }
        }

        setProject(projectData);
        setTasks(projectTasks);
        setEmployees(employeeRes.data);
      } catch (err) {
        console.error(err);
        message.error("Failed to load project");
      }
    };

    fetchProject();
  }, [id, user, navigate]);

  // Filter tasks by project
  const projectTasks = tasks.filter((task) => {
    if (!task.projectId) return false;
    if (typeof task.projectId === "string") return task.projectId === id;
    if (typeof task.projectId === "object") return task.projectId.value === id;
    return false;
  });

  // Apply status filter
  const filteredTasks = filterStatus
    ? projectTasks.filter((task) => task.status === filterStatus)
    : projectTasks;

  // Generate rows for table
  const rows = filteredTasks.map((task) => {
    // Get the current status (including any unsaved changes)
    const currentStatus =
      unsavedTasks.find((t) => t.id === task.id)?.status || task.status;

    const items = statusOptions
      .filter((status) => status !== currentStatus)
      .map((status) => ({ key: status, label: status }));

    return {
      tasks: task.taskName,
      employees: (task.employees || [])
        .filter(Boolean)
        .map(
          (empId) => employees.find((e) => e.id === empId)?.name || "Unknown"
        )
        .join(", "),
      dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—",
      status: (
        <Dropdown
          menu={{
            items,
            onClick: (e) => {
              const newStatus = e.key;

              // Update UI immediately
              setTasks((prev) =>
                prev.map((t) =>
                  t.id === task.id ? { ...t, status: newStatus } : t
                )
              );

              // Track unsaved changes
              setUnsavedTasks((prev) => {
                const already = prev.find((t) => t.id === task.id);
                if (already) {
                  return prev.map((t) =>
                    t.id === task.id ? { ...t, status: newStatus } : t
                  );
                }
                return [...prev, { ...task, status: newStatus }];
              });
            },
          }}
          trigger={["click"]}
        >
          {/* Wrap Button in a span or div to fix the React.Children.only error */}
          <span>
            <Button>{currentStatus}</Button>
          </span>
        </Dropdown>
      ),
    };
  });

  // Save changes
  const handleSaveChanges = async () => {
    try {
      await Promise.all(
        unsavedTasks.map((task) =>
          api.patch(`/tasks/${task.id}`, { status: task.status })
        )
      );
      setUnsavedTasks([]);
      message.success("✅ All changes saved!");
    } catch (err) {
      console.error(err);
      message.error("❌ Failed to save changes!");
    }
  };

  // Delete project
  const handleDeleteProject = async () => {
    try {
      await api.delete(`/projects/${id}`);
      message.success("✅ Project deleted successfully!");
      navigate("/admin/project");
    } catch (err) {
      console.error(err);
      message.error("❌ Failed to delete project!");
    }
  };

  return (
    <div className="container mx-auto px-5">
      {/* Project Header */}
      <div className="flex justify-between items-center mt-5 gap-3">
        {project && (
          <div className="flex flex-col mt-3 gap-3">
            <h2 className="font-bold text-3xl">
              Project: {project.projectName}
            </h2>
            <p className="text-[#61758A]">{project.description}</p>
          </div>
        )}
        <div className="flex gap-3 flex-none">
          {user?.role === "admin" && (
            <Link
              to={`/admin/project/edit/${id}`}
              className="bg-[#F0F2F5] text-sm py-2 px-4 rounded-lg font-medium cursor-pointer"
            >
              Edit Project
            </Link>
          )}

          <Link
            to={`../tasks?projectId=${id}`}
            className="bg-[#F0F2F5] text-sm py-2 px-4 rounded-lg font-medium cursor-pointer"
          >
            Add Task
          </Link>
        </div>
      </div>

      {/* Assigned Employees */}
      <div className="flex flex-col mt-4 gap-2">
        <h4 className="text-lg font-bold">Assigned Employees</h4>
        <div>
          {Array.isArray(project?.employees) &&
            project?.employees.map((empId, index) => {
              const emp = employees?.find((e) => e.id === empId);
              return (
                <span key={empId}>
                  {emp?.name || "Unknown"}
                  {index < project.employees.length - 1 && ", "}
                </span>
              );
            })}
        </div>
      </div>

      {/* Tasks Table */}
      <div className="flex justify-between items-center mt-5">
        <h4 className="font-bold text-lg">Tasks</h4>
        <div className="flex gap-2">
          <label className="font-medium">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="">All</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Table columns={Project_columns} data={rows} />

      {/* Add Task Button */}
      <div className="flex mt-4">
        <Link
          to={`../tasks?projectId=${id}`}
          className="bg-[#F0F2F5] text-sm py-2 px-4 rounded-lg font-medium cursor-pointer"
        >
          Add Task
        </Link>
      </div>

      {/* Save Changes & Delete */}
      <div className="flex justify-end gap-3 mt-4">
        {user?.role === "admin" && (
          <Popconfirm
            title="Are you sure you want to delete this project?"
            onConfirm={handleDeleteProject}
            okText="Yes"
            cancelText="No"
          >
            <button className="bg-[#F0F2F5] text-sm py-2 px-4 rounded-lg font-medium cursor-pointer">
              Delete Project
            </button>
          </Popconfirm>
        )}
        <button
          onClick={handleSaveChanges}
          disabled={unsavedTasks.length === 0}
          className={`text-sm py-2 px-4 rounded-lg font-medium ${
            unsavedTasks.length === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-[#0D80F2] text-white"
          }`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
