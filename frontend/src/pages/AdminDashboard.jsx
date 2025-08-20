import { Link } from "react-router-dom";
import Table from "../components/Table";
import { useState, useEffect } from "react";
import api from "../services/api";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees");
        setEmployees(res.data);
      } catch (err) {
        setError(`Failed to load employees: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const Employee_columns = [
    {
      key: "name",
      header: "Name",
      render: (value) => <span className="text-black">{value}</span>,
    },
    { key: "email", header: "Email" },
    { key: "department", header: "Department" },
    { key: "role", header: "Role" },
  ];

  const Project_columns = [
    {
      key: "projectName",
      header: "Project Name",
      render: (value) => <span className="text-black">{value}</span>,
    },
    { key: "description", header: "Description" },
    { key: "tasks", header: "Tasks" },
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
        setError(`Failed to load projects:${err.message}`);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProject();
  }, []);

  return (
    <div>
      <div className="container">
        <div className="grid grid-cols-2 gap-6 mt-9">
          <div className="p-6 border border-gray-200 rounded-lg">
            <h2 className="text-base font-semibold">Total Projects</h2>
            <p className="text-2xl font-bold ">{projects.length}</p>
          </div>
          <div className="p-6 border border-gray-200  rounded-lg">
            <h2 className="text-base font-semibold">Total Employees</h2>
            <p className="text-2xl font-bold">{employees.length}</p>
          </div>
        </div>
      </div>
      {/* Employee table */}
      <div className="container">
        <div className="flex justify-between items-center mt-9">
          <h2 className="font-bold text-[22px]">Employees</h2>
          <Link
            to="/admin/employees/add"
            className="bg-[#DBE8F2] rounded-xl p-2.5 font-bold text-sm cursor-pointer"
          >
            Add New Employee
          </Link>
        </div>
        {loading ? (
          <p>Loading employees…</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <Table columns={Employee_columns} data={employees} />
        )}
      </div>
      {/* Project Table */}
      <div className="container">
        <div className="flex justify-between items-center mt-16">
          <h2 className="font-bold text-[22px]">Projects</h2>
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

export default AdminDashboard;
