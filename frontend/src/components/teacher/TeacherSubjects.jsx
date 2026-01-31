import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getTeacherProfile, getTeacherSubjects } from "../../services/apis";
import Footer from "../ad-hoc/Footer";
import { LogOut, Search } from "lucide-react";

const TeacherSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const subs = await getTeacherSubjects(userId);
        setSubjects(Array.isArray(subs) ? subs : []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const profile = await getTeacherProfile();
      setTeacher(profile);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
    const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const filteredSubjects = subjects.filter(
    (sub) =>
      sub.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              CopyCatch
            </h1>
          </Link>
          <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-gray-300 hover:text-pink-500 transition duration-200">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="text-center py-16 px-6">
        <p className="text-2xl md:text-3xl font-semibold text-gray-300 mb-4">
          👋 Hi, {teacher?.name}! Welcome back.
        </p>

        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Your Subjects
        </h1>
        <p className="text-gray-400 mt-4">
          Manage your assignments and check plagiarism easily.
        </p>

        {/* Search Bar */}
        <div className="mt-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl shadow-md backdrop-blur-sm bg-gray-800/60 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="px-6 pb-16">
        {filteredSubjects.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">No subjects found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSubjects.map((subject) => (
              <div
                key={subject._id}
                className="p-6 rounded-2xl backdrop-blur-md bg-gray-900/70 shadow-lg border border-gray-800 hover:border-pink-500 hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {subject.subjectName}
                </h2>
                <p className="text-gray-400 mt-1">{subject.courseCode}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {subject.department} - {subject.year}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() =>
                      navigate(`/add-assignment/${subject._id}`, { state: { subject } })
                    }
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:scale-105 hover:shadow-xl transition duration-200"
                  >
                    Add Assignment
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/check-plagiarism/${subject._id}`, { state: { subject } })
                    }
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:scale-105 hover:shadow-xl transition duration-200"
                  >
                    Check Plagiarism
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto backdrop-blur-md bg-gray-900/80">
        <Footer />
      </div>
    </div>
  );
};

export default TeacherSubjects;
