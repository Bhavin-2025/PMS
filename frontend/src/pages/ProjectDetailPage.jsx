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

  // Fetch tasks
  useEffect(() => {
    api.get("/tasks").then((res) => setTasks(res.data));
  }, []);

  // Filter tasks by project
  const projectTasks = tasks.filter((task) => {
    if (!task.projectId) return false;
    if (typeof task.projectId === "string") {
      return task.projectId === id;
    }
    if (typeof task.projectId === "object") {
      return task.projectId.value === id;
    }
    return false;
  });

  const rows =
    projectTasks.map((task) => {
      const items = statusOptions
        .filter((status) => status !== task.status) // only show other statuses
        .map((status) => ({
          key: status,
          label: status,
        }));

      return {
        tasks: task.taskName,
        employees: (task.employees || [])
          .filter(Boolean)
          .map(
            (empId) => employees.find((e) => e.id === empId)?.name || "Unknown"
          )
          .join(", "),
        dueDate: task.dueDate
          ? new Date(task.dueDate).toLocaleDateString()
          : "—",
        status: (
          <Dropdown
            menu={{
              items,
              onClick: (e) => {
                const newStatus = e.key;

                // Update UI
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
            <Button>{task.status}</Button>
          </Dropdown>
        ),
      };
    }) || [];

  // Fetch project details
  useEffect(() => {
    api.get(`/projects/${id}`).then((res) => setProject(res.data));
  }, [id]);

  // Fetch employees
  useEffect(() => {
    api.get(`/employees`).then((res) => setEmployees(res.data));
  }, []);

  const handleSaveChanges = async () => {
    try {
      await Promise.all(
        unsavedTasks.map((task) =>
          api.patch(`/tasks/${task.id}`, { status: task.status })
        )
      );
      setUnsavedTasks([]); // reset after save
      message.success("✅ All changes saved!");
    } catch (err) {
      console.error("❌ Error saving changes:", err);
      message.error("❌ Failed to save changes!");
    }
  };

  const handleDeleteProject = async () => {
    try {
      await api.delete(`/projects/${id}`);
      message.success("✅ Project deleted successfully!");
      navigate("/admin/project"); // redirect to project list
    } catch (err) {
      console.error("❌ Error deleting project:", err);
      message.error("❌ Failed to delete project!");
    }
  };

  return (
    <div>
      <div className="container">
        <div className="flex justify-between items-center mt-5">
          {project && (
            <div className="flex flex-col mt-3 gap-3">
              <h2 className="font-bold text-3xl">
                Project: {project.projectName}
              </h2>
              <p className="text-[#61758A]">{project.description}</p>
            </div>
          )}
          <div className="flex gap-7">
            <Link className="bg-[#F0F2F5] text-sm py-2 px-4 rounded-lg font-medium cursor-pointer">
              Edit Project
            </Link>
            <Link
              to={`/admin/project/tasks?projectId=${id}`}
              className="bg-[#F0F2F5] text-sm py-2 px-4 rounded-lg font-medium cursor-pointer"
            >
              Add Task
            </Link>
          </div>
        </div>

        <div className="flex flex-col mt-4 gap-2">
          <h4 className="text-lg font-bold">Assigned Employees</h4>
          <div>
            {Array.isArray(project?.employees) &&
              project?.employees?.map((empId, index) => {
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

        <div className="flex justify-between items-center mt-5">
          <h4 className="font-bold text-lg">Tasks</h4>
        </div>

        <Table columns={Project_columns} data={rows} />

        <div className="flex mt-4">
          <Link
            to={`/admin/project/tasks?projectId=${id}`}
            className="bg-[#F0F2F5] text-sm py-2 px-4 rounded-lg font-medium cursor-pointer"
          >
            Add Task
          </Link>
        </div>

        <div className="flex justify-end gap-5">
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

          <Link
            onClick={handleSaveChanges}
            className={`text-sm py-2 px-4 rounded-lg font-medium cursor-pointer ${
              unsavedTasks.length === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-[#0D80F2] text-white"
            }`}
          >
            Save Changes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
