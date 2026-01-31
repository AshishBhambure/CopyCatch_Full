// import React, { useState } from "react";
// import { updateStudentYear } from "../../services/apis";

// const Profile = () => {
//   const [year, setYear] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleUpdateYear = async () => {
//     try {
//       setLoading(true);
//       const res = await updateStudentYear(year);
//       alert("Profile updated successfully!");
//       setLoading(false);
//     } catch (error) {
//       alert("Failed to update year!");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-6">
//       <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
//         <h2 className="text-2xl font-semibold mb-4 text-gray-800">Update Profile</h2>

//         <label className="block text-gray-600 mb-2">Select Your Year</label>
//         <select
//           value={year}
//           onChange={(e) => setYear(e.target.value)}
//           className="border border-gray-300 rounded-md p-2 w-full"
//         >
//           <option value="">-- Select Year --</option>
//           <option value="FY">First Year (FY)</option>
//           <option value="SY">Second Year (SY)</option>
//           <option value="TY">Third Year (TY)</option>
//           <option value="LY">Final Year (LY)</option>
//         </select>

//         <button
//           onClick={handleUpdateYear}
//           disabled={loading}
//           className="mt-4 w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
//         >
//           {loading ? "Updating..." : "Update Year"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Profile;


import React, { useState, useEffect } from "react";
import { getStudentProfile, updateStudentYear } from "../../services/apis";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [student, setStudent] = useState(null);
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch student profile from existing API
  const fetchProfile = async () => {
    try {
      const data = await getStudentProfile();
      setStudent(data);
      setYear(data.year || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateYear = async () => {
    if (!year) return alert("Please select a year first!");
    try {
      setLoading(true);
      await updateStudentYear(year); // call existing API
      alert("Year updated successfully!");
      setLoading(false);
      navigate("/student-dashboard"); // redirect to dashboard
    } catch (error) {
      console.error(error);
      alert("Failed to update year!");
      setLoading(false);
    }
  };

  if (!student) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        Loading profile...
      </div>
    );
  }

  // Function to get initials for profile icon
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-black p-6">
  <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl p-8 w-full max-w-md text-center shadow-xl hover:shadow-2xl transition-all duration-300">
    
    {/* Profile Icon */}
    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
      {getInitials(student.name)}
    </div>

    <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
      Your Profile
    </h2>

    <p className="text-white mb-1"><strong>Name:</strong> {student.name}</p>
    <p className="text-gray-400 mb-1"><strong>PRN:</strong> {student.prn}</p>
    <p className="text-gray-400 mb-1"><strong>Email:</strong> {student.email}</p>
    <p className="text-gray-400 mb-4"><strong>Mobile:</strong> {student.mobile || "N/A"}</p>

    <label className="block text-gray-400 mb-2 font-medium">Select/Update Your Year</label>
    <select
      value={year}
      onChange={(e) => setYear(e.target.value)}
      className="border border-gray-700 rounded-xl p-2 w-full mb-4 bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
    >
      <option value="">-- Select Year --</option>
      <option value="FY">First Year (FY)</option>
      <option value="SY">Second Year (SY)</option>
      <option value="TY">Third Year (TY)</option>
      <option value="LY">Final Year (LY)</option>
    </select>

    <button
      onClick={handleUpdateYear}
      disabled={loading}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300"
    >
      {loading ? "Updating..." : "Update Year"}
    </button>
  </div>
</div>

  );
};

export default Profile;
