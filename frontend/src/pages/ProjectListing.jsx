// import Table from "../components/Table";
// import React, { useEffect, useState } from "react";
// import api from "../services/api";
// import { Link } from "react-router-dom";

// const ProjectListing = () => {
//   const Project_columns = [
//     {
//       key: "projectName",
//       header: "Project Name",
//       render: (value) => <span className="text-black">{value}</span>,
//     },
//     { key: "description", header: "Description" },
//     {
//       key: "tasks",
//       header: "Tasks",
//       render: (tasks) => <span>{tasks?.length || 0} tasks</span>, // show task count
//     },
//     {
//       key: "id",
//       header: "Actions",
//       render: (id) => (
//         <Link to={`${id}`} className="font-bold text-sm text-[#6B7582]">
//           View
//         </Link>
//       ),
//     },
//   ];

//   const [projects, setProjects] = useState([]);
//   const [loadingProjects, setLoadingProjects] = useState(true);
//   const [projectError, setProjectError] = useState();

//   useEffect(() => {
//     const fetchProjectsAndTasks = async () => {
//       try {
//         // fetch both projects and tasks in parallel
//         const [projectsRes, tasksRes] = await Promise.all([
//           api.get("/projects"),
//           api.get("/tasks"),
//         ]);

//         const projectsWithTasks = projectsRes.data.map((p) => {
//           // find tasks belonging to this project
//           const projectTasks = tasksRes.data.filter(
//             (t) => t.projectId === p.id
//           );
//           return { ...p, tasks: projectTasks }; // attach tasks array
//         });

//         setProjects(projectsWithTasks);
//       } catch (err) {
//         setProjectError(`Failed to load projects: ${err.message}`);
//       } finally {
//         setLoadingProjects(false);
//       }
//     };

//     fetchProjectsAndTasks();
//   }, []);

//   return (
//     <div>
//       {/* Project Table */}
//       <div className="container">
//         <div className="flex justify-between items-center mt-8">
//           <h2 className="font-bold text-3xl">Projects</h2>
//           <Link
//             to="/admin/project/create"
//             className="bg-[#DBE8F2] rounded-xl p-2.5 font-bold text-sm cursor-pointer"
//           >
//             Create New Project
//           </Link>
//         </div>

//         {loadingProjects ? (
//           <p>Loading Projects...</p>
//         ) : projectError ? (
//           <p className="text-red-500">{projectError}</p>
//         ) : (
//           <Table columns={Project_columns} data={projects} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProjectListing;

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
    {
      key: "tasks",
      header: "Tasks",
      render: (tasks) => <span>{tasks?.length || 0} tasks</span>,
    },
    {
      key: "id",
      header: "Actions",
      render: (id) => (
        <Link to={`${id}`} className="font-bold text-sm text-[#6B7582]">
          View
        </Link>
      ),
    },
  ];

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProjectsAndTasks = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          api.get("/projects"),
          api.get("/tasks"),
        ]);

        let projectsWithTasks = projectsRes.data.map((p) => {
          const projectTasks = tasksRes.data.filter(
            (t) => t.projectId === p.id
          );
          return { ...p, tasks: projectTasks };
        });

        // 🔹 If employee, only show projects where he has at least one task
        if (user?.role === "employee") {
          projectsWithTasks = projectsWithTasks.filter((p) =>
            p.tasks.some((t) => (t.employees || []).includes(user.id))
          );
        }

        setProjects(projectsWithTasks);
      } catch (err) {
        setProjectError(`Failed to load projects: ${err.message}`);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjectsAndTasks();
  }, [user]);

  return (
    <div className="container">
      <div className="flex justify-between items-center mt-8">
        <h2 className="font-bold text-3xl">Projects</h2>
        {user?.role === "admin" && (
          <Link
            to="/admin/project/create"
            className="bg-[#DBE8F2] rounded-xl p-2.5 font-bold text-sm cursor-pointer hover:bg-[#cadbe8]"
          >
            Create New Project
          </Link>
        )}
      </div>

      {loadingProjects ? (
        <p>Loading Projects...</p>
      ) : projectError ? (
        <p className="text-red-500">{projectError}</p>
      ) : projects.length === 0 ? (
        <p className="mt-5">No data to display</p>
      ) : (
        <Table columns={Project_columns} data={projects} />
      )}
    </div>
  );
};

export default ProjectListing;
