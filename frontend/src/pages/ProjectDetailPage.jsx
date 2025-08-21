import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { Button } from "antd";

const ProjectDetailPage = () => {
  const Project_columns = [
    { key: "tasks", header: "Tasks" },
    { key: "employees", header: "Assignee" },
    { key: "dueDate", header: "Due Date" },
    { key: "status", header: "Status" },
  ];

  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get("/tasks").then((res) => setTasks(res.data));
  }, []);

  // 🔑 Normalize projectId for comparison
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
    projectTasks.map((task) => ({
      tasks: task.taskName,
      employees: (task.employees || [])
        .filter(Boolean) // remove nulls
        .map(
          (empId) => employees.find((e) => e.id === empId)?.name || "Unknown"
        )
        .join(", "),
      dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—",
      status: task.status,
    })) || [];

  useEffect(() => {
    api.get(`/projects/${id}`).then((res) => setProject(res.data));
  }, [id]);

  console.log(project);

  useEffect(() => {
    api.get(`/employees`).then((res) => setEmployees(res.data));
  }, []);
  console.log("project?.employees", Array.isArray(project?.employees));

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
          <div className="flex gap-5">
            <button className="py-1.5 px-4 text-sm bg-[#F0F2F5] rounded-lg font-medium cursor-pointer">
              Not Started
            </button>
            <button className="py-1.5 px-4 text-sm bg-[#F0F2F5] rounded-lg font-medium cursor-pointer">
              In Progress
            </button>
            <button className="py-1.5 px-4 text-sm bg-[#F0F2F5] rounded-lg font-medium cursor-pointer">
              Completed
            </button>
          </div>
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
          <button className="bg-[#F0F2F5] text-sm py-2 px-4 rounded-lg font-medium cursor-pointer">
            Delete Project
          </button>
          <Link className="bg-[#0D80F2] text-white text-sm py-2 px-4 rounded-lg font-medium cursor-pointer">
            Save Changes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
