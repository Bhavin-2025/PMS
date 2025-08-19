import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AdminDashboard from "../pages/AdminDashboard";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import PageNotFound from "../pages/PageNotFound";
import RequireAuth from "../components/RequireAuth";
import { ROLES } from "../config";
import HomeLayout from "../components/HomeLayout";
import AddEmployeePage from "../pages/AddEmployeePage";
import CreateNewProject from "../pages/CreateNewProject";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
        <Route element={<HomeLayout />}>

          <Route
            path="/admin"
            element={
              <RequireAuth allowedRoles={[ROLES.ADMIN]}>
                <Outlet />
              </RequireAuth>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="employees/add" element={<AddEmployeePage />} />
            <Route path="project/create" element={<CreateNewProject/>}/>
          </Route>
          <Route
            path="/employee"
            element={
              <RequireAuth allowedRoles={[ROLES.EMPLOYEE]}>
                <Outlet />
              </RequireAuth>
            }
          >
            <Route index element={<EmployeeDashboard />} />
          </Route>
          <Route />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
