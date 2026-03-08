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
          <h1 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent pb-4">
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
        <div className="overflow-x-auto border border-gray-700 rounded-2xl bg-gray-800/60 backdrop-blur-md shadow-lg">

          <table className="w-full text-left">

            {/* TABLE HEADER */}

            <thead className="bg-gray-900 text-gray-300 uppercase text-sm tracking-wider">

              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">PRN</th>
                <th className="px-6 py-4">Version</th>
                <th className="px-6 py-4">Submitted At</th>
                <th className="px-6 py-4">Similarity</th>
                <th className="px-6 py-4">Details</th>
              </tr>

            </thead>



            {/* TABLE BODY */}

            <tbody>

              {sortedData.map((doc, index) => (

                <tr
                  key={index}
                  onClick={() =>
                    navigate(
                      `/compare-documents/${assignmentId}/${submissionId}/${doc.submission_id}`,
                      {
                        state: {
                          originalSubmissionId: submissionId,
                          assignmentId,
                          otherSubmissionId: doc.submission_id,
                          plagData: doc.matched_chunks || [],
                          similarityScore: doc.similarity_score,
                        },
                      }
                    )
                  }
                  className="border-t border-gray-700 hover:bg-gray-700/40 cursor-pointer transition-all duration-200"
                >

                  {/* STUDENT */}

                  <td className="px-6 py-4 font-semibold text-white">
                    {doc.studentName}
                  </td>



                  {/* PRN */}

                  <td className="px-6 py-4 text-gray-300">
                    {doc?.studentPRN}
                  </td>



                  {/* VERSION */}

                  <td className="px-6 py-4 text-gray-300">
                    v{doc?.version}
                  </td>

                  <td className="px-6 py-4 text-gray-300">
                    {new Date(doc?.submittedAt)?.toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>



                  {/* SIMILARITY */}

                  <td className="px-6 py-4">

                    <span
                      className={`text-sm font-bold px-3 py-1 rounded-lg ${doc.similarity_score > 0.4
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                        : "bg-gradient-to-r from-purple-400 to-pink-500 text-white"
                        }`}
                    >
                      {(doc.similarity_score * 100).toFixed(1)}%
                    </span>

                  </td>



                  {/* ACTION */}

                  <td className="px-6 py-4 text-purple-400 font-medium">

                    Click to compare →

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
};

export default CheckSimilarDocuments;
