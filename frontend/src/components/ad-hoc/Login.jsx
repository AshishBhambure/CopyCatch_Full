import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Mail, Lock, UserCircle, LogIn } from "lucide-react";
import { adminBaseUrl, studentBaseUrl, teacherBaseUrl } from "../../services/baseUrl";



export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "", role: "student" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => 
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Select API endpoint based on role
      let apiUrl = "";
      if (formData.role === "student") apiUrl = `${studentBaseUrl}/login`;
      else if (formData.role === "teacher") apiUrl = `${teacherBaseUrl}/login`;
      else if (formData.role === "admin") apiUrl = `${adminBaseUrl}/login`;

      // API Call
      const res = await axios.post(apiUrl, {
        email: formData.email,
        password: formData.password,
      });

      setMessage(res.data.message || "Login successful");

      // Save token and role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", formData.role);
      localStorage.setItem("userId", res.data.studentId || res.data.adminId || res.data.teacherId);

      // Navigate based on role
      if (formData.role === "student") navigate("/student-dashboard");
      else if (formData.role === "teacher") navigate("/teacher-subjects");
      else navigate("/admin-dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-700 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-700 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
      </div>

      {/* Login Card */}
      <div className="relative bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 p-8 w-full max-w-md hover:shadow-2xl transition-all duration-300 text-gray-100">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-300 text-sm mt-2">Sign in to continue to CopyCatch</p>
        </div>

        {/* Error/Success Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
            message.includes("successful")
              ? "bg-green-800/30 text-green-400 border border-green-700"
              : "bg-red-800/30 text-red-400 border border-red-700"
          }`}>
            {message}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="your.email@college.edu"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-900/50 text-gray-100 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-900/50 text-gray-100 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Login As
            </label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-900/50 text-gray-100 appearance-none cursor-pointer"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Login
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-indigo-400 hover:text-purple-400 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}