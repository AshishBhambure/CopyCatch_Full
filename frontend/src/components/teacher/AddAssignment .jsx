import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createAssignment,
  deleteAssignment,
  getAssignmentsBySubject,
  getSubjectbyId,
  updateAssignment,
} from "../../services/apis";
import Footer from "../ad-hoc/Footer";

const AddAssignment = () => {
  const { subjectId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [subject, setSubject] = useState(null);
  const navigate = useNavigate();

  const [assignmentForm, setAssignmentForm] = useState({
    assignmentTitle: "",
    questionPaperLink: "",
    minMatchLength: 8,
    subjectId: "",
  });

  useEffect(() => {
    const fetch = async () => {
      setAssignmentForm((prev) => ({ ...prev, subjectId }));
      const assignmentsFromApi = await getAssignmentsBySubject(subjectId);
      setAssignments(assignmentsFromApi);
    };
    fetch();
  }, [subjectId]);

  const fetchSubject = async () => {
    const data = await getSubjectbyId(subjectId);
    setSubject(data);
  };
  useEffect(() => {
    fetchSubject();
  }, [subjectId]);

  const openModalForAdd = () => {
    setEditingAssignment(null);
    setAssignmentForm({
      assignmentTitle: "",
      questionPaperLink: "",
      minMatchLength: 8,
      subjectId,
    });
    setIsModalOpen(true);
  };

  const openModalForEdit = (assignment) => {
    setEditingAssignment(assignment);
    setAssignmentForm({
      assignmentTitle: assignment.assignmentTitle,
      questionPaperLink: assignment.questionPaperLink,
      minMatchLength: assignment.minMatchLength,
      subjectId: assignment.subjectId,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "questionPaperLink" && files?.length > 0) {
      setAssignmentForm({ ...assignmentForm, questionPaperLink: files[0] });
    } else {
      setAssignmentForm({ ...assignmentForm, [name]: value });
    }
  };

  const handleSaveAssignment = async () => {
    try {
      if (editingAssignment) {
        const updated = await updateAssignment(editingAssignment._id, assignmentForm);
        setAssignments(
          assignments.map((a) => (a._id === editingAssignment._id ? updated : a))
        );
      } else {
        const created = await createAssignment(assignmentForm);
        setAssignments([...assignments, created]);
        window.location.reload();

      }
      setIsModalOpen(false);
      setEditingAssignment(null);
      setAssignmentForm({ assignmentTitle: "", questionPaperLink: "", minMatchLength: 8, subjectId });
      window.location.reload();

    } catch (err) {
      console.error("Error saving assignment:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await deleteAssignment(id);
      setAssignments(assignments.filter((a) => a._id !== id));
      window.location.reload();

    } catch (err) {
      console.error("Error deleting assignment:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-black text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 shadow-md rounded-b-2xl mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-xl font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Assignments - {subject?.subjectName || ""}
          </h1>
          <button
            onClick={openModalForAdd}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition duration-300"
          >
            + Add Assignment
          </button>

        </div>
      </header>

      {/* Assignments Grid */}
      {assignments.length === 0 ? (
        <p className="text-center text-gray-400 mt-8">
          Upload your first assignment now!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((a) => (
            <div
              key={a._id}
              className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-800 hover:border-pink-500 hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <h2 className="text-xl font-bold text-white">{a.assignmentTitle}</h2>
              <p className="mt-2 text-gray-400">Min Match Length: {a.minMatchLength}</p>

              <a
                href={`https://docs.google.com/viewer?url=${encodeURIComponent(a.questionPaperLink)}&embedded=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 mt-2 inline-block hover:underline"
              >
                View Question Paper
              </a>


              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => openModalForEdit(a)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-xl hover:scale-105 hover:shadow-lg transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-xl hover:scale-105 hover:shadow-lg transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-11/12 md:w-1/2 relative">
            <button
              className="absolute top-3 right-3 text-gray-300 hover:text-white text-xl font-bold"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {editingAssignment ? "Edit Assignment" : "Add New Assignment"}
            </h2>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="assignmentTitle"
                placeholder="Assignment Title"
                className="border border-gray-700 bg-gray-800/60 backdrop-blur-sm p-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                value={assignmentForm.assignmentTitle}
                onChange={handleInputChange}
              />
              <input
                type="file"
                name="questionPaperLink"
                className="border border-gray-700 bg-gray-800/60 backdrop-blur-sm p-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="minMatchLength"
                placeholder="Minimum Match Length"
                className="border border-gray-700 bg-gray-800/60 backdrop-blur-sm p-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                value={assignmentForm.minMatchLength}
                onChange={handleInputChange}
              />
              <button
                onClick={handleSaveAssignment}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-2xl shadow-md hover:scale-105 hover:shadow-xl transition duration-300"
              >
                {editingAssignment ? "Update Assignment" : "Add Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AddAssignment;
