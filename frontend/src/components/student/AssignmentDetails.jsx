import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Paperclip,
  UploadCloud,
  FileCheck,
  Trash2,
  ArrowLeft,
  X,
} from "lucide-react";
import {
  createSubmission,
  deleteSubmission,
  getAssignmentById,
  getSubmissionsByAssignment,
  updateSubmission,
} from "../../services/apis";
import StudentNavbar from "./StudentNavbar";

export default function AssignmentDetails() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modals
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const assignmentData = await getAssignmentById(assignmentId);
      setAssignment(assignmentData);

      const submissionsData = await getSubmissionsByAssignment(assignmentId);
      setSubmissions(submissionsData || null);
    };
    fetchData();
  }, [assignmentId, loading]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!file) return alert("Please select a file!");
    setLoading(true);
    const newSubmission = await createSubmission(assignmentId, file);
    // setSubmissions(newSubmission);
    setLoading(false);
    // window.location.reload(); // 🔥 Force page refresh

  };

  // const handleUpdate = async () => {
  //   if (!file) return alert("Please select a new file!");
  //   setLoading(true);
  //   const updatedSubmission = await updateSubmission(submission?._id, file);
  //   setSubmission(updatedSubmission);
  //   setLoading(false);
  //   setShowUpdateModal(false);
  //   window.location.reload(); // 🔥 Force page refresh

  // };

  // const handleDelete = async () => {
  //   if (!submission?._id) return alert("No submission to delete!");
  //   setLoading(true);
  //   await deleteSubmission(submission._id);
  //   setSubmission(null);
  //   setLoading(false);
  //   setShowDeleteModal(false);
  //   alert("Submission deleted!");
  //   window.location.reload(); // 🔥 Force page refresh

  // };

  if (!assignment) return <p className="text-center p-6">Loading assignment...</p>;

  return (
    <>
    <div className=" sticky top-0 right-0 z-10">
    <StudentNavbar/>
    </div>
    <div className="min-h-screen bg-black/95 text-white py-10 px-4">
    
      <div className="max-w-3xl mx-auto space-y-6">
        


        {/* Assignment Card */}
        <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            <FileCheck className="text-indigo-400" /> {assignment.assignmentTitle}
          </h1>
          {/* <a
        href={assignment.questionPaperLink}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-indigo-300 hover:underline text-sm"
      >
        <Paperclip size={16} /> View Question Paper
      </a> */}

          <a
            href={`https://docs.google.com/viewer?url=${encodeURIComponent(assignment.questionPaperLink)}&embedded=true`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-indigo-300 hover:underline text-sm"
          ><Paperclip size={16} /> View Question Paper
          </a>

        </div>

        <div>
          <>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <UploadCloud className="text-yellow-400" /> Add New Submission
              </h2>
              <span className="px-2 py-1 bg-red-600 rounded-full text-xs font-semibold">
                Not Submitted
              </span>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              className="mb-4 w-full text-gray-200 bg-gray-800 rounded-lg p-2"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition transform text-white px-5 py-2 rounded-xl w-full"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            {file && <p className="text-gray-300 mt-2 text-sm">Selected file: {file.name}</p>}
          </>
        </div>
        {/* Here there Can Be Multiple Submissions Handle this using Map */}
        {/* Submission Card */}
        <div className="space-y-4">
          {submissions && submissions.length > 0 ? (
            submissions.map((submission) => (
              <div
                key={submission._id}
                className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileCheck className="text-green-400" /> Submission Version - {submission?.version || 1}
                  </h2>

                  <span className="px-2 py-1 bg-green-600 rounded-full text-xs font-semibold">
                    Submitted
                  </span>
                </div>

                <p className="text-gray-400 mb-2">
                  Submitted on:{" "}
                  <span className="text-indigo-300">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </span>
                </p>

                <a
                  href={`https://docs.google.com/viewer?url=${encodeURIComponent(
                    submission.submissionLink
                  )}&embedded=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-xl text-sm hover:bg-gray-800 transition"
                >
                  <Paperclip size={16} /> View File
                </a>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center">No submissions found.</div>
          )}
        </div>
      </div>

      {/* Update Modal */}
      {/* {showUpdateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 w-full max-w-md relative shadow-xl">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4">Update Submission</h3>
            <input
              type="file"
              onChange={handleFileChange}
              className="mb-4 w-full text-gray-200 bg-gray-800 rounded-lg p-2"
            />
            {file && <p className="text-gray-300 mb-4">Selected: {file.name}</p>}
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-xl text-white transition transform hover:scale-105"
            >
              {loading ? "Updating..." : "Confirm Update"}
            </button>
          </div>
        </div>
      )} */}

      {/* Delete Modal */}
      {/* {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 w-full max-w-sm relative text-center shadow-xl">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to delete your submission?</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-white transition transform hover:scale-105"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-xl text-white transition transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
    </>

  );
}
