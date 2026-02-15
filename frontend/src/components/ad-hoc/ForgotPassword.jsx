import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../services/baseUrl";
import { toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailRegex =
    /^[a-zA-Z0-9]+\.[a-zA-Z0-9]+@walchandsangli\.ac\.in$/;

  /* ---------------- SEND OTP ---------------- */
  const handleSendOtp = async () => {
    if (!emailRegex.test(email)) {
      toast.warn("Email must be firstname.lastname@walchandsangli.ac.in");
      return;
    }

    try {
      setLoading(true);
      const toastId = toast.loading("Sending OTP...");
      
      await axios.post(`${baseUrl}/api/auth/sendOtpForgotPass`, { email });

      toast.dismiss(toastId);
      toast.success("OTP sent successfully!");
      setOtpSent(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.warn("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${baseUrl}/api/auth/verifyOtp`, {
        email,
        otp,
      });

      if (res?.data?.success) {
        toast.success("Email verified");
        setEmailVerified(true);
      }
    } catch (err) {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESET PASSWORD ---------------- */
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const toastId = toast.loading("Resetting password...");

      // YOU will create this backend API
      await axios.post(`${baseUrl}/api/auth/forgotPassword`, {
        email,
        password: newPassword,
      });

      toast.dismiss(toastId);
      toast.success("Password reset successful!");
      navigate("/login")
      
    } catch (err) {
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-gray-800/70 backdrop-blur-md rounded-2xl p-8 w-full max-w-md text-gray-100 space-y-4">

        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>

        {/* EMAIL */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="College Email"
            value={email}
            disabled={otpSent}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-11 py-3 rounded-xl bg-gray-900 border border-gray-600"
          />
        </div>

        {!otpSent && (
          <button
            onClick={handleSendOtp}
            className="w-full bg-indigo-600 py-3 rounded-xl"
          >
            Send OTP
          </button>
        )}

        {/* OTP */}
        {otpSent && !emailVerified && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
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

        {/* RESET PASSWORD */}
        {emailVerified && (
          <>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-11 py-3 rounded-xl bg-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 py-3 rounded-xl bg-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3"
              >
                {showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>
            </div>

            <button
              onClick={handleResetPassword}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-3 rounded-xl"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;