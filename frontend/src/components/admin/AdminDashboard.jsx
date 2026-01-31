import React, { useEffect, useState } from "react";
import { UserPlus, BookOpen, Users, GraduationCap, Mail, Phone, Code, Building2, Calendar, Edit, Trash2 } from "lucide-react";
import {
  createTeacher,
  getTeachers,
  updateTeacher,
  deleteTeacher,
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject
} from "../../services/apis";

const AdminDashboard = () => {
  // Teachers
  const [teachers, setTeachers] = useState([]);
  const [teacherForm, setTeacherForm] = useState({ name: "", email: "", password: "", mobile: "" });
  const [editingTeacherId, setEditingTeacherId] = useState(null);

  // Subjects
  const [subjects, setSubjects] = useState([]);
  const [subjectForm, setSubjectForm] = useState({ subjectName: "", courseCode: "", teacherId: "", department: "", year: "" });
  const [editingSubjectId, setEditingSubjectId] = useState(null);

  // Fetch teachers and subjects
  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
  }, []);

  const fetchTeachers = async () => {
    const data = await getTeachers();
    setTeachers(data);
  };

  const fetchSubjects = async () => {
    const data = await getSubjects();
    setSubjects(data);
  };

  const handleTeacherChange = (e) => {
    const { name, value } = e.target;
    setTeacherForm({ ...teacherForm, [name]: value });
  };

  const handleSubjectChange = (e) => {
    const { name, value } = e.target;
    setSubjectForm({ ...subjectForm, [name]: value });
  };

  const handleCreateOrUpdateTeacher = async () => {
    try {
      if (editingTeacherId) {
        await updateTeacher(editingTeacherId, teacherForm);
        alert("Teacher updated successfully!");
      } else {
        await createTeacher(teacherForm);
        alert("Teacher created successfully!");
      }
      setTeacherForm({ name: "", email: "", password: "", mobile: "" });
      setEditingTeacherId(null);
      fetchTeachers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save teacher");
    }
  };

  const handleEditTeacher = (teacher) => {
    setTeacherForm({ name: teacher.name, email: teacher.email, password: "", mobile: teacher.mobile });
    setEditingTeacherId(teacher._id);
  };

  const handleDeleteTeacher = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await deleteTeacher(id);
        fetchTeachers();
        alert("Teacher deleted successfully!");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete teacher");
      }
    }
  };

  const handleCreateOrUpdateSubject = async () => {
    try {
      if (editingSubjectId) {
        await updateSubject(editingSubjectId, subjectForm);
        alert("Subject updated successfully!");
      } else {
        await createSubject(subjectForm);
        alert("Subject created successfully!");
      }
      setSubjectForm({ subjectName: "", courseCode: "", teacherId: "", department: "", year: "" });
      setEditingSubjectId(null);
      fetchSubjects();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save subject");
    }
  };

  const handleEditSubject = (subject) => {
    setSubjectForm({
      subjectName: subject.subjectName,
      courseCode: subject.courseCode,
      teacherId: subject.teacherId?._id || "",
      department: subject.department,
      year: subject.year
    });
    setEditingSubjectId(subject._id);
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await deleteSubject(id);
        fetchSubjects();
        alert("Subject deleted successfully!");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete subject");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-800/70 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Create / Edit Teacher */}
        <div className="p-8 backdrop-blur-md bg-gray-800/70 rounded-2xl border border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">{editingTeacherId ? "Edit Teacher" : "Create Teacher"}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input type="text" name="name" placeholder="Name" value={teacherForm.name} onChange={handleTeacherChange} className="p-3 rounded-xl bg-gray-700/70 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" />
            <input type="email" name="email" placeholder="Email" value={teacherForm.email} onChange={handleTeacherChange} className="p-3 rounded-xl bg-gray-700/70 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" />
            <input type="password" name="password" placeholder="Password" value={teacherForm.password} onChange={handleTeacherChange} className="p-3 rounded-xl bg-gray-700/70 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" />
            <input type="text" name="mobile" placeholder="Mobile" value={teacherForm.mobile} onChange={handleTeacherChange} className="p-3 rounded-xl bg-gray-700/70 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" />
            <button onClick={handleCreateOrUpdateTeacher} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-xl hover:scale-105 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200">{editingTeacherId ? "Update" : "Create"}</button>
          </div>
        </div>

        {/* Teacher List */}
        <div className="p-8 backdrop-blur-md bg-gray-800/70 rounded-2xl border border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">All Teachers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((t) => (
              <div key={t._id} className="group p-6 bg-gray-700/70 rounded-xl border border-gray-600 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <p className="font-bold">{t.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditTeacher(t)} className="p-1 rounded bg-yellow-600/20 hover:bg-yellow-500/30">
                      <Edit className="w-4 h-4 text-yellow-400" />
                    </button>
                    <button onClick={() => handleDeleteTeacher(t._id)} className="p-1 rounded bg-red-600/20 hover:bg-red-500/30">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-400" /><span>{t.email}</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-400" /><span>{t.mobile}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create / Edit Subject */}
        <div className="p-8 backdrop-blur-md bg-gray-800/70 rounded-2xl border border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">{editingSubjectId ? "Edit Subject" : "Create Subject"}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <input type="text" name="subjectName" placeholder="Subject Name" value={subjectForm.subjectName} onChange={handleSubjectChange} className="p-3 rounded-xl bg-gray-700/70 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200" />
            <input type="text" name="courseCode" placeholder="Course Code" value={subjectForm.courseCode} onChange={handleSubjectChange} className="p-3 rounded-xl bg-gray-700/70 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200" />
            <select name="teacherId" value={subjectForm.teacherId} onChange={handleSubjectChange} className="p-3 rounded-xl bg-gray-700/70 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200">
              <option value="">Assign Teacher</option>
              {teachers.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
            <input type="text" name="department" placeholder="Department" value={subjectForm.department} onChange={handleSubjectChange} className="p-3 rounded-xl bg-gray-700/70 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200" />
            <select name="year" value={subjectForm.year} onChange={handleSubjectChange} className="p-3 rounded-xl bg-gray-700/70 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200">
              <option value="">Select Year</option>
              <option value="FY">FY</option>
              <option value="SY">SY</option>
              <option value="TY">TY</option>
              <option value="LY">LY</option>
            </select>
            <button onClick={handleCreateOrUpdateSubject} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-xl hover:scale-105 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200">{editingSubjectId ? "Update" : "Create"}</button>
          </div>
        </div>

        {/* Subject List */}
        <div className="p-8 backdrop-blur-md bg-gray-800/70 rounded-2xl border border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">All Subjects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <div key={s._id} className="group p-6 bg-gray-700/70 rounded-xl border border-gray-600 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <p className="font-bold">{s.subjectName}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditSubject(s)} className="p-1 rounded bg-yellow-600/20 hover:bg-yellow-500/30">
                      <Edit className="w-4 h-4 text-yellow-400" />
                    </button>
                    <button onClick={() => handleDeleteSubject(s._id)} className="p-1 rounded bg-red-600/20 hover:bg-red-500/30">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2"><Code className="w-4 h-4 text-purple-400" /><span><strong>Code:</strong> {s.courseCode}</span></div>
                  <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-purple-400" /><span><strong>Dept:</strong> {s.department}</span></div>
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-400" /><span><strong>Year:</strong> {s.year}</span></div>
                  <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-purple-400" /><span><strong>Teacher:</strong> {s.teacherId?.name || 'Not assigned'}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
