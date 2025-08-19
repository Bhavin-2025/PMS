import React from "react";
import logo from "../assets/sarvadhi.svg";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white flex justify-between items-center px-10 border-b border-gray-200 py-4">
      <div>
        <img src={logo} alt="sarvadhi" />
      </div>
      <nav className=" flex gap-9 items-center text-sm text-[#121417] font-medium">
        <Link
          className="hover:underline decoration-[#2A67B2] underline-offset-10  "
          to="/admin"
        >
          Dashboard
        </Link>
        <Link
          to="/admin/employees/add"
          className="hover:underline decoration-[#2A67B2] underline-offset-10 "
        >
          Employees
        </Link>
        <Link
          className="hover:underline decoration-[#2A67B2] underline-offset-10 "
          to="/admin/project/create"
        >
          Projects
        </Link>
        <Link
          className="hover:underline decoration-[#2A67B2] underline-offset-10 "
          to="/admin/tasks"
        >
          Task
        </Link>
        <button className="bg-[#F2F2F5] rounded-xl p-3 font-bold">
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
