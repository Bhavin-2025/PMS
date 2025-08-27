import React from "react";
import logo from "../assets/sarvadhi.svg";
import { NavLink } from "react-router-dom";
import { Avatar, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="sticky top-0 z-50 bg-white flex justify-between items-center px-10 border-b border-gray-200 py-4">
      {/* Logo */}
      <div>
        <img src={logo} alt="sarvadhi" />
      </div>

      {/* Navigation */}
      <nav className="flex gap-9 items-center text-sm text-[#121417] font-medium">
        {user?.role === "admin" && (
          <>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                isActive
                  ? "underline decoration-[#2A67B2] underline-offset-10"
                  : "hover:underline decoration-[#2A67B2] underline-offset-10"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/employees/add"
              end
              className={({ isActive }) =>
                isActive
                  ? "underline decoration-[#2A67B2] underline-offset-10"
                  : "hover:underline decoration-[#2A67B2] underline-offset-10"
              }
            >
              Employees
            </NavLink>
            <NavLink
              to="/admin/project"
              end
              className={({ isActive }) =>
                isActive
                  ? "underline decoration-[#2A67B2] underline-offset-10"
                  : "hover:underline decoration-[#2A67B2] underline-offset-10"
              }
            >
              Projects
            </NavLink>
            <NavLink
              to="/admin/project/tasks"
              end
              className={({ isActive }) =>
                isActive
                  ? "underline decoration-[#2A67B2] underline-offset-10"
                  : "hover:underline decoration-[#2A67B2] underline-offset-10"
              }
            >
              Task
            </NavLink>
          </>
        )}

        {user?.role === "employee" && (
          <>
            <NavLink
              to="/employee/project"
              end
              className={({ isActive }) =>
                isActive
                  ? "underline decoration-[#2A67B2] underline-offset-10"
                  : "hover:underline decoration-[#2A67B2] underline-offset-10"
              }
            >
              Projects
            </NavLink>
            <NavLink
              to="/employee/project/tasks"
              end
              className={({ isActive }) =>
                isActive
                  ? "underline decoration-[#2A67B2] underline-offset-10"
                  : "hover:underline decoration-[#2A67B2] underline-offset-10"
              }
            >
              Task
            </NavLink>
          </>
        )}

        {/* User Section */}
        <div className="flex items-center gap-2">
          <Avatar
            size="small"
            icon={<UserOutlined />}
            style={{ backgroundColor: "#2A67B2" }}
          />
          <span className="font-semibold text-[#2A67B2]">{user?.name}</span>
        </div>

        {/* Logout */}
        <NavLink
          className="bg-[#F2F2F5] flex items-center gap-2 rounded-xl px-3 py-2 font-bold hover:bg-gray-200"
          to="/login"
        >
          <LogoutOutlined />
          Logout
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
