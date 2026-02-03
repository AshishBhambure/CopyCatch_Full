import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { baseUrl } from "../../services/baseUrl";
import { toast } from "react-toastify";

export default function SignupForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    mobile: "",
    prn: "",
    role: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const emailRegex =
    /^[a-zA-Z0-9]+\.[a-zA-Z0-9]+@walchandsangli\.ac\.in$/;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ---------------- SEND OTP ---------------- */
  const handleSendOtp = async () => {
    if (!emailRegex.test(formData.email)) {
      setMessage(
        "Email must be firstname.lastname@walchandsangli.ac.in"
      );
      toast.warn("Email must be firstname.lastname@walchandsangli.ac.in");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      var toastId = toast.loading("Please wait, sending OTP...");
      await axios.post(`${baseUrl}/api/auth/sendOtp`, {
        email: formData.email,
      });
      toast.dismiss(toastId);
      toast.success("OTP sent successfully!");
      setOtpSent(true);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message,"Error while sending OTP");
    } finally {
      setLoading(false);
      toast.dismiss(toastId)
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.warn("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${baseUrl}/api/auth/verifyOtp`,
        {
          email: formData.email,
          otp,
        }
      );

      if (res?.data?.success) {
        setEmailVerified(true);
        toast.success("Email verified successfully");
      }
    } catch (err) {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      toast.warn("Please select a role");
      return;
    }

    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const apiUrl = `${baseUrl}/api/${formData.role}/signup`;
      const res = await axios.post(apiUrl, formData);
      toast.success("Signup successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.error ||
          "Error occurred during signup"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-gray-800/70 backdrop-blur-md rounded-2xl p-8 w-full max-w-md text-gray-100">
        <div className="flex flex-col items-center mb-6">
          <Shield className="w-10 h-10 text-indigo-400" />
          <h2 className="text-2xl font-bold mt-2">
            Create Account
          </h2>
        </div>

        <div className="space-y-4  flex flex-col gap-y-2">
          <div>
            <label className="pl-2 font-semibold">
              College Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={otpSent}
                placeholder="firstname.lastname@walchandsangli.ac.in"
                className="w-full pl-11 py-3 rounded-xl bg-gray-900 border border-gray-600"
              />
            </div>
          </div>

          {!otpSent && (
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-indigo-600 py-3 rounded-xl"
            >
              Send OTP
            </button>
          )}

          {otpSent && !emailVerified && (
            <>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6 digit OTP"
                className="w-full py-3 px-4 rounded-xl bg-gray-900 border border-gray-600"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleVerifyOtp}
                  className="flex-1 bg-green-600 py-3 rounded-xl"
                >
                  Verify OTP
                </button>
                <button
                  onClick={handleSendOtp}
                  className="flex-1 bg-gray-700 py-3 rounded-xl"
                >
                  Resend
                </button>
              </div>
            </>
          )}
        </div>

        {/* ---------------- REST OF FORM ---------------- */}
        {emailVerified && (
          <form
            className="space-y-4 mt-6"
            onSubmit={handleSubmit}
          >
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full py-3 px-4 rounded-xl bg-gray-900"
            />

            <input
              name="prn"
              placeholder="PRN Number"
              onChange={handleChange}
              className="w-full py-3 px-4 rounded-xl bg-gray-900"
            />

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full pl-11 py-3 rounded-xl bg-gray-900"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-3"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Re-enter Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="w-full pl-11 py-3 rounded-xl bg-gray-900"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-3"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            <input
              name="mobile"
              placeholder="Mobile (optional)"
              onChange={handleChange}
              className="w-full py-3 px-4 rounded-xl bg-gray-900"
            />

            <select
              name="role"
              onChange={handleChange}
              className="w-full py-3 px-4 rounded-xl bg-gray-900"
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
            </select>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-3 rounded-xl"
            >
              Create Account
            </button>
          </form>
        )}

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
