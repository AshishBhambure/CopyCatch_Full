import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowUpDown, FileText, AlertCircle } from "lucide-react";
import { getAssignmentById, getSimilarityReportBySubmission, getStudentbySubmissionId } from "../../services/apis";

const CheckSimilarDocuments = () => {
  const { assignmentId, submissionId } = useParams();
  const navigate = useNavigate();

  const [plagData, setPlagData] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await getSimilarityReportBySubmission(submissionId);
      console.log("Plagiarism data fetched:", data);
      setPlagData(data?.plagarized_with || []);
      setLoading(false);
    };
    fetch();
  }, [assignmentId, submissionId]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getAssignmentById(assignmentId);
      setAssignment(data);
    };
    fetch();
  }, [assignmentId]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getStudentbySubmissionId(submissionId);
      setStudent(data);
    };
    fetch();
  }, [submissionId]);

  const sortedData = [...plagData].sort((a, b) =>
    sortOrder === "asc"
      ? a.similarity_score - b.similarity_score
      : b.similarity_score - a.similarity_score
  );

  const toggleSortOrder = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc");

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading plagiarism data...</p>
        </div>
      </div>
    );

  if (!plagData || plagData.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-8">
        <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-xl font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            ← Back
          </button>
        <div className="backdrop-blur-md bg-gray-800/70 rounded-2xl shadow-xl p-12 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300 text-lg">No similar documents found for this submission.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="backdrop-blur-md bg-gray-800/70 rounded-2xl shadow-xl p-8 mb-8 border border-gray-700">
         <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-xl font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            ← Back
          </button>
          <h1 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Similar Documents Analysis
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="mb-3">
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Assignment</span>
                <p className="text-lg font-medium text-white mt-1">{assignment?.assignmentTitle}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Student Name</span>
                <p className="text-lg font-medium text-white mt-1">{student?.student?.name}</p>
              </div>
            </div>

            <button
              onClick={toggleSortOrder}
              className="group backdrop-blur-md bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>Sort: {sortOrder === "asc" ? "Low → High" : "High → Low"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 rounded-xl p-3">
            <FileText className="w-4 h-4 text-purple-500" />
            <span className="font-medium">{sortedData.length}</span> similar documents found
          </div>
        </div>

        {/* Cards Section */}
        <div className="space-y-4">
          {sortedData.map((doc, index) => (
            <div
              key={index}
              onClick={() =>
                navigate(`/compare-documents/${assignmentId}/${submissionId}/${doc.submission_id}`, {
                  state: {
                    originalSubmissionId: submissionId,
                    assignmentId,
                    otherSubmissionId: doc.submission_id,
                    plagData: doc.matched_chunks || [],
                    similarityScore: doc.similarity_score,
                  },
                })
              }
              className="group backdrop-blur-md bg-gray-800/60 hover:bg-gray-800/70 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-700 cursor-pointer transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Student</p>
                      <p className="text-xl font-bold text-white">{doc.studentName}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">Similarity</p>
                    <span
                      className={`inline-block text-2xl font-bold px-4 py-2 rounded-xl shadow-md ${
                        doc.similarity_score > 0.4
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "bg-gradient-to-r from-purple-400 to-pink-500 text-white"
                      }`}
                    >
                      {(doc.similarity_score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gray-700/50 rounded-xl p-4 border border-gray-600/50">
                  <p className="text-gray-300 leading-relaxed">
                    This document has a{" "}
                    <span className="font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                      {(doc.similarity_score * 100).toFixed(1)}%
                    </span>{" "}
                    similarity score with the current submission.
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-end text-sm text-gray-400 group-hover:text-purple-400 transition-colors duration-200">
                  <span className="font-medium">Click to view detailed comparison</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckSimilarDocuments;
