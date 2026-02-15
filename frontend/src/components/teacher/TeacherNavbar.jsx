import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TeacherNavbar = ({ student }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      // TODO ::  LoCalStiorage Not Fliushing Entirely Chcek 
      // localStorage.removeItem("userId");
      // localStorage.removeItem("role");
      navigate("/");
    }
  };

  return (
    <nav className="w-full bg-[#0a0a0a] text-white border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      {/* Left Section: Logo + Title */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/teacher-dashboard")}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <span className="text-xl font-semibold text-white">Teacher Dashboard</span>
      </div>



      {/* Right Section: Profile + Logout */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-all duration-200"
        >
          Logout
        </button>


          {student?.name?.charAt(0).toUpperCase() || "S"}
        </div>
    </nav>
  );
};

export default TeacherNavbar;
