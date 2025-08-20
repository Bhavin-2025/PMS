import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import { Link } from "react-router-dom";
import AddTask from "./AddTask";
import { useParams } from "react-router-dom";
import api from "../services/api";

const ProjectDetailPage = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [employees, setEmployees] = useState(null);

  useEffect(() => {
    api.get(`/projects/${id}`).then((res) => setProject(res.data));
  }, [id]);

  useEffect(() => {
    api.get(`/employees`).then((res) => setEmployees(res.data));
  }, []);
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
          <Link
            to={`/admin/project/tasks?id=${id}`}
            className="bg-[#F0F2F5] text-sm py-2 px-4 rounded-lg font-medium cursor-pointer"
          >
            Add Task
          </Link>
        </div>
        <div className="flex flex-col mt-4 gap-2">
          <h4 className="text-lg font-bold">Assigned Employees</h4>
          <div>
            {project?.employees.map((empId, index) => {
              const emp = employees.find((e) => e.id === empId);
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
        <Table />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
