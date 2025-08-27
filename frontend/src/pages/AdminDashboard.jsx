import { Link } from "react-router-dom";
import Table from "../components/Table";
import { useState, useEffect } from "react";
import api from "../services/api";
import { Button, Popconfirm, message, Card, Skeleton, Empty } from "antd";
import {
  DeleteOutlined,
  TeamOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState();

  // Fetch Employees
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

  // Fetch Projects
  useEffect(() => {
    const fetchProjectsAndTasks = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          api.get("/projects"),
          api.get("/tasks"),
        ]);

        const projectsWithTasks = projectsRes.data.map((p) => {
          const projectTasks = tasksRes.data.filter(
            (t) => t.projectId === p.id
          );
          return { ...p, tasks: projectTasks };
        });

        setProjects(projectsWithTasks);
      } catch (err) {
        setProjectError(`Failed to load projects: ${err.message}`);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjectsAndTasks();
  }, []);

  // Delete Employee
  const handleDeleteEmployee = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      message.success("Employee deleted successfully");
    } catch (err) {
      message.error("Failed to delete employee: " + err.message);
    }
  };

  // Employee Table Columns
  const Employee_columns = [
    {
      key: "name",
      header: "Name",
      render: (value) => <span className="text-black">{value}</span>,
    },
    { key: "email", header: "Email" },
    { key: "department", header: "Department" },
    { key: "role", header: "Role" },
    {
      key: "action",
      header: "Action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this employee?"
          onConfirm={() => handleDeleteEmployee(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger type="text" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  // Project Table Columns
  const Project_columns = [
    {
      key: "projectName",
      header: "Project Name",
      render: (value) => <span className="text-black">{value}</span>,
    },
    { key: "description", header: "Description" },
    {
      key: "tasks",
      header: "Tasks",
      render: (tasks) => <span>{tasks?.length || 0} tasks</span>,
    },
  ];

  return (
    <div className="container mx-auto px-6 py-6">
      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Card
          hoverable
          className="rounded-2xl shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-600">
                Total Projects
              </h2>
              <p className="text-3xl font-bold mt-1">{projects.length}</p>
            </div>
            <FolderOpenOutlined
              style={{ fontSize: "36px", color: "#1677ff" }}
            />
          </div>
        </Card>

        <Card
          hoverable
          className="rounded-2xl shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-600">
                Total Employees
              </h2>
              <p className="text-3xl font-bold mt-1">{employees.length}</p>
            </div>
            <TeamOutlined style={{ fontSize: "36px", color: "#52c41a" }} />
          </div>
        </Card>
      </div>

      {/* Employees Table */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-[22px]">Employees</h2>
          <Link
            to="/admin/employees/add"
            className="bg-[#DBE8F2] rounded-xl px-4 py-2 font-bold text-sm cursor-pointer hover:bg-[#cadbe8]"
          >
            Add New Employee
          </Link>
        </div>

        {loading ? (
          <Skeleton active />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : employees.length === 0 ? (
          <Empty description="No employees found" />
        ) : (
          <Table columns={Employee_columns} data={employees} />
        )}
      </div>

      {/* Projects Table */}
      <div className="mt-16">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-[22px]">Projects</h2>
          <Link
            to="/admin/project/create"
            className="bg-[#DBE8F2] rounded-xl px-4 py-2 font-bold text-sm cursor-pointer hover:bg-[#cadbe8]"
          >
            Create New Project
          </Link>
        </div>

        {loadingProjects ? (
          <Skeleton active />
        ) : projectError ? (
          <p className="text-red-500">{projectError}</p>
        ) : projects.length === 0 ? (
          <Empty description="No projects found" />
        ) : (
          <Table columns={Project_columns} data={projects} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
