import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FileText, TrendingUp, CheckCircle } from "lucide-react";
import { getAssignmentById, getEnhancedSimilarityReport } from "../../services/apis";

const CompareSimilarity = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    originalSubmissionId,
    assignmentId,
    otherSubmissionId,
    plagData,
    similarityScore,
    originalLink,
    otherLink,
  } = location.state || {};

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchedSubmission, setMatchedSubmission] = useState(null);
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!originalSubmissionId) return;
        const data = await getEnhancedSimilarityReport(originalSubmissionId);
        setReport(data);
        for (let matchData of data.matchedSubmissions || []) {
          if (matchData.matchedSubmissionId === otherSubmissionId) {
            setMatchedSubmission(matchData);
            break;
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [originalSubmissionId, otherSubmissionId]);

  useEffect(() => {
    const fetchAssignment = async () => {
      const data = await getAssignmentById(assignmentId);
      setAssignment(data);
    };
    fetchAssignment();
  }, [assignmentId]);

  if (!location.state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="backdrop-blur-md bg-gray-800/70 rounded-2xl p-8 shadow-xl text-center">
          <p className="text-gray-300 mb-4">No data received. Go back and select a submission.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-xl font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Loading detailed comparison...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="backdrop-blur-md bg-gray-800/70 rounded-2xl p-8 shadow-xl text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-xl font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const score = matchedSubmission?.similarityScore || similarityScore;
  const scoreColor =
    score > 0.7 ? "bg-red-600 text-white" : score > 0.4 ? "bg-yellow-500 text-black" : "bg-green-500 text-white";
  const riskText = score > 0.7 ? "High" : score > 0.4 ? "Medium" : "Low";
  const riskColor = score > 0.7 ? "text-red-500" : score > 0.4 ? "text-yellow-500" : "text-green-500";

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-gray-800/70 rounded-b-2xl p-4 shadow-md mb-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Similarity Comparison Report
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-xl font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Assignment Info */}
        <div className="backdrop-blur-md bg-gray-800/70 rounded-2xl shadow-xl p-6 border border-gray-700 hover:scale-105 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-bold mb-4 text-white">Assignment Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400">Assignment Name:</span>
              <span className="ml-2 font-medium">{assignment?.assignmentTitle}</span>
            </div>
            <div>
              <span className="text-gray-400">Similarity Score:</span>
              <span className={`ml-2 px-3 py-1 rounded-full text-sm ${scoreColor}`}>
                {(score * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Submissions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {["Original", "Matched"].map((type, idx) => {
            const sub = type === "Original" ? report?.originalSubmission : matchedSubmission;
            const grad = type === "Original" ? "from-purple-600 to-pink-600" : "from-red-500 to-pink-600";
            const link = type === "Original" ? originalLink : otherLink;
            return (
              <div
                key={idx}
                className={`backdrop-blur-md bg-gray-800/70 rounded-2xl shadow-xl p-6 border border-gray-700 hover:scale-105 hover:shadow-2xl transition-all duration-300`}
              >
                <h2 className={`text-xl font-bold mb-4 flex items-center gap-2`}>
                  <span className={`bg-gradient-to-r ${grad} text-white px-2 py-1 rounded text-sm`}>
                    {type}
                  </span> Submission
                </h2>
                {sub?.student && (
                  <div>
                    <p className="font-medium">{sub.student.name} -- {sub.student.prn}</p>
                    <p className="text-gray-400">{sub.student.email}</p>
                  </div>
                )}
                {(sub?.pdfUrl || link) && (
                  // <a
                  //   href={sub?.pdfUrl || link}
                  //   target="_blank"
                  //   rel="noopener noreferrer"
                  //   className="text-purple-400 hover:text-pink-400 underline block mt-1 break-all"
                  // >
                  //   View Submission
                  // </a>

                  <a
                href={`https://docs.google.com/viewer?url=${encodeURIComponent(sub?.pdfUrl || link)}&embedded=true`}
                target="_blank"
                rel="noopener noreferrer"
                    className="text-purple-400 hover:text-pink-400 underline block mt-1 break-all"
              >                View Submission

              </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Raw Text Comparison */}
        {report?.originalSubmission?.rawText && (
          <div className="backdrop-blur-md bg-gray-800/70 rounded-2xl shadow-xl p-6 border border-gray-700 hover:scale-105 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" /> Raw Text Comparison
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {["originalSubmission", "matchedSubmission"].map((key, idx) => {
                const sub = key === "originalSubmission" ? report.originalSubmission : matchedSubmission;
                const grad = key === "originalSubmission" ? "from-purple-600 to-pink-600" : "from-red-500 to-pink-600";
                return (
                  <div key={idx} className="backdrop-blur-md bg-gray-700/50 rounded-xl p-4 max-h-96 overflow-y-auto">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                      <span className={`bg-gradient-to-r ${grad} text-white px-2 py-0.5 rounded text-xs`}>
                        {key === "originalSubmission" ? "Original" : "Matched"}
                      </span> Text
                    </h3>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{sub?.rawText || "No text available"}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Matched Chunks */}
        <div className="backdrop-blur-md bg-gray-800/70 rounded-2xl shadow-xl p-6 mb-6 border border-gray-700 hover:scale-105 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pink-500" /> Matched Content Chunks
          </h2>
          {!matchedSubmission?.matched_chunks?.length ? (
            <p className="text-gray-400">No matched chunks found between these submissions.</p>
          ) : (
            <div className="space-y-4">
              {matchedSubmission.matched_chunks.map((chunk, idx) => (
                <div key={idx} className="backdrop-blur-md bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-white mb-2">Chunk {idx + 1}</h3>
                  <p className="text-gray-300 text-sm">{chunk}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="backdrop-blur-md bg-gray-800/70 rounded-2xl shadow-xl p-6 mt-6 border border-gray-700 hover:scale-105 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" /> Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-48 justify-between">
            <div className="backdrop-blur-md bg-gray-700/50 rounded-xl p-4 text-center hover:scale-105 hover:shadow-lg transition-all duration-300">
              <p className="text-gray-400 text-sm mb-1">Overall Similarity</p>
              <p className="text-2xl font-bold text-white">{(score * 100).toFixed(1)}%</p>
            </div>
            <div className="backdrop-blur-md bg-gray-700/50 rounded-xl p-4 text-center hover:scale-105 hover:shadow-lg transition-all duration-300">
              <p className="text-gray-400 text-sm mb-1">Matched Chunks</p>
              <p className="text-2xl font-bold text-white">{matchedSubmission?.matched_chunks?.length || 0}</p>
            </div>
            {/* <div className="backdrop-blur-md bg-gray-700/50 rounded-xl p-4 text-center hover:scale-105 hover:shadow-lg transition-all duration-300">
              <p className="text-gray-400 text-sm mb-1">Risk Level</p>
              <p className={`text-2xl font-bold ${riskColor}`}>{riskText}</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareSimilarity;
