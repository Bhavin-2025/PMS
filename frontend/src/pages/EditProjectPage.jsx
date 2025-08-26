import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { message, Select, Button } from "antd";
import InputField from "../components/InputField";

const EditProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [employees, setEmployees] = useState([]);
  const [assignedEmployees, setAssignedEmployees] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/"); // Redirect non-admin users
    }
  }, [user, navigate]);

  // Fetch all employees
  useEffect(() => {
    api.get("/employees").then((res) => setEmployees(res.data));
  }, []);

  // Fetch project details
  useEffect(() => {
    api.get(`/projects/${id}`).then((res) => {
      const project = res.data;
      setProjectName(project.projectName);
      setDescription(project.description);
      setAssignedEmployees(project.employees || []);
    });
  }, [id]);

  const handleSave = async () => {
    try {
      await api.patch(`/projects/${id}`, {
        projectName,
        description,
        employees: assignedEmployees,
      });
      message.success("✅ Project updated successfully!");
      navigate(`/admin/project/${id}`); // Go back to project detail page
    } catch (err) {
      console.error(err);
      message.error("❌ Failed to update project!");
    }
  };

  return (
    <div className="container">
      <div className="mx-auto px-5 mt-5">
        <h2 className="font-bold text-2xl mb-4">Edit Project</h2>

        <div className="flex flex-col gap-4 max-w-md">
          <div>
            <label className="font-medium">Project Name</label>

            <InputField
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              rows={4}
            />
          </div>

          <div>
            <label className="font-medium">Assign Employees</label>
            <Select
              mode="multiple"
              placeholder="Select Employees"
              value={assignedEmployees}
              onChange={setAssignedEmployees}
              options={employees.map((e) => ({ label: e.name, value: e.id }))}
              className="w-full"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
            <Button onClick={() => navigate(`/admin/project/${id}`)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProjectPage;
