import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Button, Dropdown, Popconfirm, message, Avatar, Tooltip } from "antd";
import {
  DeleteOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  FlagOutlined,
} from "@ant-design/icons";

const statusOptions = ["Not Started", "In Progress", "Completed"];

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [unsavedTasks, setUnsavedTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // Fetch project, tasks, employees
  useEffect(() => {
    if (!user) return;

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

        // Employee project access check
        if (user?.role === "employee") {
          const isAssignedToProject = projectData.employees?.includes(user.id);
          if (!isAssignedToProject) {
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

  // Table columns
  const baseColumns = [
    { key: "tasks", header: "Task Name" },
    { key: "description", header: "Description" },
    { key: "employees", header: "Assignee" },
    { key: "priority", header: "Priority" },
    { key: "dueDate", header: "Due Date" },
    { key: "status", header: "Status" },
  ];

  const Project_columns =
    user?.role === "admin"
      ? [...baseColumns, { key: "actions", header: "Actions" }]
      : baseColumns;

  // Filter tasks by status
  const filteredTasks = filterStatus
    ? tasks.filter((task) => task.status === filterStatus)
    : tasks;

  // Map rows for table
  const rows =
    filteredTasks.length > 0
      ? filteredTasks.map((task) => {
          const currentStatus =
            unsavedTasks.find((t) => t.id === task.id)?.status || task.status;

          const items = statusOptions
            .filter((status) => status !== currentStatus)
            .map((status) => ({ key: status, label: status }));

          // 🔔 Due date check
          let dueDateDisplay = "—";
          if (task.dueDate) {
            const due = new Date(task.dueDate);
            const today = new Date();
            const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

            dueDateDisplay = (
              <div className="flex items-center gap-1">
                <span>{due.toLocaleDateString()}</span>
                {diffDays <= 3 && diffDays >= 0 && (
                  <Tooltip title="Due date is near!">
                    <ExclamationCircleOutlined style={{ color: "red" }} />
                  </Tooltip>
                )}
              </div>
            );
          }

          let priorityIcon;
          if (task.priority === "high") {
            priorityIcon = (
              <div className="flex justify-center">
                <Tooltip title="High Priority">
                  <FlagOutlined style={{ color: "red", fontSize: "16px" }} />
                </Tooltip>
              </div>
            );
          } else if (task.priority === "medium") {
            priorityIcon = (
              <div className="flex justify-center">
                <Tooltip title="Medium Priority">
                  <FlagOutlined style={{ color: "orange", fontSize: "16px" }} />
                </Tooltip>
              </div>
            );
          } else if (task.priority === "low") {
            priorityIcon = (
              <div className="flex justify-center">
                <Tooltip title="Low Priority">
                  <FlagOutlined style={{ color: "green", fontSize: "16px" }} />
                </Tooltip>
              </div>
            );
          } else {
            priorityIcon = <div className="flex justify-center">-</div>;
          }

          const row = {
            // priority: priorityIcon,
            tasks: task.taskName,
            description: task.description,
            employees: (task.employees || [])
              .map(
                (empId) =>
                  employees.find((e) => e.id === empId)?.name || "Unknown"
              )
              .join(", "),
            priority: priorityIcon,
            dueDate: dueDateDisplay,
            status: (
              <Dropdown
                menu={{
                  items,
                  onClick: (e) => {
                    const newStatus = e.key;
                    setTasks((prev) =>
                      prev.map((t) =>
                        t.id === task.id ? { ...t, status: newStatus } : t
                      )
                    );
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
                <span>
                  <Button>{currentStatus}</Button>
                </span>
              </Dropdown>
            ),
          };

          if (user?.role === "admin") {
            row.actions = (
              <Popconfirm
                title="Are you sure you want to delete this task?"
                onConfirm={() => handleDeleteTask(task.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger type="text" icon={<DeleteOutlined />} />
              </Popconfirm>
            );
          }

          return row;
        })
      : user?.role === "employee"
      ? [
          {
            priority: "-",
            tasks: "No tasks assigned yet",
            description: "-",
            employees: "-",
            dueDate: "-",
            status: "-",
          },
        ]
      : [];

  // Delete task
  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setUnsavedTasks((prev) => prev.filter((t) => t.id !== taskId));
      message.success("✅ Task deleted successfully!");
    } catch (err) {
      console.error(err);
      message.error("❌ Failed to delete task!");
    }
  };

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

  if (!user) return <div>Loading...</div>;

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
              className="bg-[#F0F2F5] text-sm py-2 px-4 rounded-lg font-medium cursor-pointer hover:bg-gray-200"
            >
              Edit Project
            </Link>
          )}
          <Link
            to={`../tasks?projectId=${id}`}
            className="bg-[#F0F2F5] text-sm py-2 px-4 rounded-lg font-medium cursor-pointer hover:bg-gray-200 "
          >
            Add Task
          </Link>
        </div>
      </div>

      {/* ✅ Assigned Employees with Avatar + Name */}
      <div className="flex flex-col mt-4 gap-2">
        <h4 className="text-lg font-bold">Assigned Employees</h4>
        <div className="flex items-center gap-2 mt-2">
          {Array.isArray(project?.employees) &&
          project?.employees.length > 0 ? (
            (() => {
              const assigned = project.employees
                .map((empId) => employees.find((e) => e.id === empId))
                .filter(Boolean);

              // Always show all avatars
              const visibleEmployees = assigned;
              const extraCount = assigned.length - 1;

              return (
                <div className="flex items-center gap-1">
                  {visibleEmployees.map((emp) => (
                    <Tooltip
                      className="!-ml-2 first:!-ml-0 !border !border-white"
                      title={emp.name}
                      key={emp.id}
                    >
                      <Avatar
                        style={{ backgroundColor: "#1677ff" }}
                        size={22}
                        icon={<UserOutlined />}
                      >
                        {emp.name.charAt(0)}
                      </Avatar>
                    </Tooltip>
                  ))}

                  {/* Show first employee name + more */}
                  <span className="pl-1 text-sm text-gray-700 font-medium">
                    {visibleEmployees[0]?.name}
                    {extraCount > 0 && ` +${extraCount} more`}
                  </span>
                </div>
              );
            })()
          ) : (
            <span className="text-gray-500">No employees assigned</span>
          )}
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
            className="border border-gray-300 rounded px-2 py-1 cursor-pointer"
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
          className="bg-[#F0F2F5] text-sm py-2 px-4 rounded-lg font-medium cursor-pointer hover:bg-gray-200"
        >
          Add Task
        </Link>
      </div>

      {/* Save & Delete */}
      <div className="flex justify-end gap-3 mt-4">
        {user?.role === "admin" && (
          <Popconfirm
            title="Are you sure you want to delete this project?"
            onConfirm={handleDeleteProject}
            okText="Yes"
            cancelText="No"
          >
            <button className="bg-[#F0F2F5] text-sm py-2 px-4 rounded-lg font-medium cursor-pointer hover:bg-gray-200 ">
              Delete Project
            </button>
          </Popconfirm>
        )}
        <button
          onClick={handleSaveChanges}
          disabled={unsavedTasks.length === 0}
          className={`text-sm py-2 px-4 rounded-lg font-medium cursor-pointer ${
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
