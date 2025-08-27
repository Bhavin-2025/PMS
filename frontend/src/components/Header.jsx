import React from "react";
import logo from "../assets/sarvadhi.svg";
import { Link } from "react-router-dom";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    return names.length > 1 ? names[0][0] + names[1][0] : names[0][0];
  };

  return (
    <header className="sticky top-0 z-50 bg-white flex justify-between items-center px-10 border-b border-gray-200 py-4">
      <div>
        <img src={logo} alt="sarvadhi" />
      </div>

      {/* Navigation */}
      <nav className="flex gap-9 items-center text-sm text-[#121417] font-medium">
        {user?.role === "admin" && (
          <>
            <Link
              to="/admin"
              className="hover:underline decoration-[#2A67B2] underline-offset-10"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/employees/add"
              className="hover:underline decoration-[#2A67B2] underline-offset-10"
            >
              Employees
            </Link>
            <Link
              to="/admin/project"
              className="hover:underline decoration-[#2A67B2] underline-offset-10"
            >
              Projects
            </Link>
            <Link
              to="/admin/project/tasks"
              className="hover:underline decoration-[#2A67B2] underline-offset-10"
            >
              Task
            </Link>
          </>
        )}

        {user?.role === "employee" && (
          <>
            <Link
              to="/employee/project"
              className="hover:underline decoration-[#2A67B2] underline-offset-10"
            >
              Projects
            </Link>
            <Link
              to="/employee/project/tasks"
              className="hover:underline decoration-[#2A67B2] underline-offset-10"
            >
              Task
            </Link>
          </>
        )}
        <div className="flex items-center gap-2">
          <Avatar
            size="small"
            icon={<UserOutlined />}
            style={{ backgroundColor: "#2A67B2" }}
          >
            {getInitials(user.name)}
          </Avatar>
          <span className="font-bold text-[#2A67B2]">{user.name}</span>
        </div>

        {/* Logout */}
        <Link
          className="bg-[#F2F2F5] rounded-xl p-3 font-bold hover:bg-gray-200"
          to="/login"
        >
          Logout
        </Link>
      </nav>
    </header>
  );
};

export default Header;
