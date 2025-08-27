import React from "react";
import logo from "../assets/sarvadhi.svg";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  return (
    <header className="sticky top-0 z-50 bg-white flex justify-between items-center px-10 border-b border-gray-200 py-4">
      <div>
        <img src={logo} alt="sarvadhi" />
      </div>

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
