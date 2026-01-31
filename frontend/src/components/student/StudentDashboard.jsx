import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentProfile, getStudentSubjects } from "../../services/apis";
import StudentNavbar from "./StudentNavbar";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch student profile and subjects
  const fetchData = async () => {
    try {
      setLoading(true);
      const profile = await getStudentProfile();
      console.log("Student Profile", profile)
      setStudent(profile);

      if (profile.year) {
        const subs = await getStudentSubjects();
        setSubjects(subs);
        setFilteredSubjects(subs);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search filter for subjects
  useEffect(() => {
    const filtered = subjects.filter(
      (sub) =>
        sub.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.teacherId?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSubjects(filtered);
  }, [searchQuery, subjects]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#0a0a0a]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-400 mt-4 text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">


      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Top Navigation Bar */}
       <div className="flex items-center justify-between mb-12">


 <StudentNavbar student={student} /> {/* ✅ Navbar added */}
</div>


        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">
            Welcome back, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{student.name || "Student"}</span> 👋
          </h1>
          <p className="text-gray-400 text-lg">Here's what's happening with your courses today</p>
        </div>

        {/* Year Not Set Alert */}
        {!student.year && (
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1">Action Required</h3>
                <p className="text-gray-300 mb-4">Please update your academic year in your profile to access your subjects.</p>
                <button
                  onClick={() => navigate("/student/profile")}
                  className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                >
                  Go to Profile
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        {student.year && (
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by subject or professor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#1a1a1a] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-200"
            />
          </div>
        )}

        {/* Stats Row */}
        {student.year && subjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Subjects</p>
                  <p className="text-3xl font-bold text-white">{subjects.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Academic Year</p>
                  <p className="text-3xl font-bold text-white">{student.year || 'N/A'}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Professors</p>
                  <p className="text-3xl font-bold text-white">{new Set(subjects.map(s => s.teacherId?.name).filter(Boolean)).size}</p>
                </div>
                <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subjects Header */}
        {student.year && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Your Subjects</h2>
            <p className="text-gray-400 mt-1">Click on any subject to view details</p>
          </div>
        )}

        {/* Subjects Grid */}
        {student.year && (
          <div>
            {filteredSubjects.length === 0 ? (
              <div className="text-center py-20 bg-[#1a1a1a] border border-gray-800 rounded-2xl">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-lg">No subjects found matching your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSubjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="group bg-[#1a1a1a] border border-gray-800 p-6 rounded-2xl hover:bg-[#1f1f1f] hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/student/subject/${subject._id}`)}
                  >
                    {/* Subject Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors duration-200">
                          {subject.subjectName}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-medium rounded-full">
                          {subject.courseCode}
                        </span>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Subject Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-gray-300">{subject.department}</span>
                      </div>
                    </div>

                    {/* Professor Info */}
                    <div className="pt-4 border-t border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                          {subject.teacherId?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {subject.teacherId?.name || "Not Assigned"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {subject.teacherId?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;