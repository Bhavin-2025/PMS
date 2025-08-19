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
    { key: "name", header: "Name", render: (value) => <span className="text-black">{value}</span>  },
    { key: "email", header: "Email" },
    { key: "department", header: "Department" },
    { key: "role", header: "Role" },
  ];

  const Project_columns = [
    { key: "name", header: "Project Name",  render: (value) => <span className="text-black">{value}</span>  },
    { key: "description", header: "Description" },
    { key: "tasks", header: "Tasks" },
  ];

  const Project_data = [
    {
      name: "Project Phoneix",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut, incidunt.",
      tasks: 10,
    },
    {
      name: "Project Aurora",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut, incidunt.",
      tasks: 12,
    },
  ];

  return (
    <div>
      <div className="container">
        <div className="grid grid-cols-2 gap-6 mt-9">
          <div className="p-6 border border-gray-200 rounded-lg">
            <h2 className="text-base font-semibold">Total Projects</h2>
            <p className="text-2xl font-bold ">12</p>
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
        <Table columns={Project_columns} data={Project_data} />
      </div>
    </div>
  );
};

export default AdminDashboard;
