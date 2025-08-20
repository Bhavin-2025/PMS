import Table from "../components/Table";
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
const ProjectListing = () => {
  const Project_columns = [
    {
      key: "projectName",
      header: "Project Name",
      render: (value) => <span className="text-black">{value}</span>,
    },
    { key: "description", header: "Description" },
    { key: "tasks", header: "Tasks" },
    {
      key: "id",
      header: "Actions",
      render: (id) => (
        <Link
          to={`/admin/project/${id}`}
          className="font-bold text-sm text-[#6B7582]"
        >
          View
        </Link>
      ),
    },
  ];

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get("/projects");

        const projectwithTasks = res.data.map((p) => ({
          ...p,
          tasks: "0 tasks",
        }));
        setProjects(projectwithTasks);
      } catch (err) {
        setProjectError(`Failed to load projects:${err.message}`);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProject();
  }, []);

  return (
    <div>
      {/* Project Table */}
      <div className="container">
        <div className="flex justify-between items-center mt-8">
          <h2 className="font-bold text-3xl">Projects</h2>
          <Link
            to="/admin/project/create"
            className="bg-[#DBE8F2] rounded-xl p-2.5 font-bold text-sm cursor-pointer"
          >
            Create New Project
          </Link>
        </div>

        {loadingProjects ? (
          <p>Loading Projects...</p>
        ) : projectError ? (
          <p className="text-red-500">{projectError}</p>
        ) : (
          <Table columns={Project_columns} data={projects} />
        )}
      </div>
    </div>
  );
};

export default ProjectListing;
