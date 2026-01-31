import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Mail, Lock, UserCircle, Phone, CreditCard, UserPlus } from "lucide-react";
import { baseUrl } from "../../services/baseUrl";


export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    prn: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!formData.role) {
        setMessage("Please select a role.");
        setLoading(false);
        return;
      }

      // API endpoint
      const apiUrl = `${baseUrl}/api/${formData.role}/signup`;
      console.log("API URL",  apiUrl)

      const res = await axios.post(apiUrl, formData);
      setMessage(res.data.message || "Signup successful!");

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        mobile: "",
        prn: "",
        role: "",
      });

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Error occurred during signup");
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

      {/* Signup Card */}
      <div className="relative bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 p-8 w-full max-w-md hover:shadow-2xl transition-all duration-300 text-gray-100">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-gray-300 text-sm mt-2">Join CopyCatch today</p>
        </div>

        {/* Error/Success Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              message.toLowerCase().includes("error") || message.includes("select")
                ? "bg-red-800/30 text-red-400 border border-red-700"
                : "bg-green-800/30 text-green-400 border border-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Signup Form */}
        <div className="space-y-4">
          {/* Full Name */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-900/50 text-gray-100 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
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

          {/* PRN Number */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">PRN Number</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="prn"
                placeholder="PRN123456"
                value={formData.prn}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-900/50 text-gray-100 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-900/50 text-gray-100 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number (Optional)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="mobile"
                placeholder="+91 1234567890"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-900/50 text-gray-100 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">Register As</label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-900/50 text-gray-100 appearance-none cursor-pointer"
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                {/* <option value="admin">Admin</option> */}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing up...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-400 hover:text-purple-400 transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}