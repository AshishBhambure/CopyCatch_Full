import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FileText, TrendingUp, CheckCircle, AlertCircle, Users, BookOpen, Sun, Moon } from "lucide-react";
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
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // Theme classes
  const theme = {
    bg: isDarkMode ? "bg-gradient-to-br from-gray-900 to-slate-900" : "bg-gradient-to-br from-slate-50 to-slate-100",
    card: isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200",
    text: {
      primary: isDarkMode ? "text-white" : "text-slate-900",
      secondary: isDarkMode ? "text-gray-300" : "text-slate-600",
      muted: isDarkMode ? "text-gray-400" : "text-slate-500",
    },
    header: isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200",
    headerGradient: isDarkMode ? "from-indigo-500 to-indigo-600" : "from-indigo-600 to-indigo-700",
    sectionGradient: {
      primary: isDarkMode ? "from-indigo-500 to-indigo-600" : "from-indigo-600 to-indigo-700",
      secondary: isDarkMode ? "from-purple-500 to-purple-600" : "from-purple-600 to-purple-700",
      success: isDarkMode ? "from-emerald-500 to-emerald-600" : "from-emerald-600 to-emerald-700",
      slate: isDarkMode ? "from-slate-600 to-slate-700" : "from-slate-700 to-slate-800",
    },
    input: isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-slate-50 border-slate-200 text-slate-700",
    textContent: isDarkMode ? "bg-gray-900 text-gray-300" : "bg-slate-50 text-slate-700",
    segment: isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-slate-200",
    segmentHeader: isDarkMode ? "bg-gray-800 border-gray-700" : "bg-slate-50 border-slate-200",
    summaryCard: {
      primary: isDarkMode ? "from-indigo-900/50 to-indigo-800/50 border-indigo-700" : "from-indigo-50 to-indigo-100 border-indigo-200",
      success: isDarkMode ? "from-emerald-900/50 to-emerald-800/50 border-emerald-700" : "from-emerald-50 to-emerald-100 border-emerald-200",
    },
    summaryText: {
      primary: isDarkMode ? "text-indigo-300" : "text-indigo-700",
      primaryBold: isDarkMode ? "text-indigo-100" : "text-indigo-900",
      success: isDarkMode ? "text-emerald-300" : "text-emerald-700",
      successBold: isDarkMode ? "text-emerald-100" : "text-emerald-900",
    },
    infoBox: isDarkMode ? "bg-blue-900/30 border-blue-700" : "bg-blue-50 border-blue-200",
    infoText: isDarkMode ? "text-blue-300" : "text-blue-700",
    infoTextBold: isDarkMode ? "text-blue-200" : "text-blue-900",
  };

  if (!location.state) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg} p-4`}>
        <div className={`${theme.card} rounded-lg shadow-lg p-8 max-w-md w-full border`}>
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className={`text-xl font-semibold ${theme.text.primary} mb-2`}>No Data Available</h2>
            <p className={`${theme.text.secondary} mb-6`}>Please select a submission to view the comparison report.</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}>
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-indigo-600 mx-auto mb-4"></div>
          </div>
          <p className={`${theme.text.primary} font-medium`}>Loading comparison report...</p>
          <p className={`${theme.text.muted} text-sm mt-2`}>Please wait while we analyze the submissions</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg} p-4`}>
        <div className={`${theme.card} rounded-lg shadow-lg p-8 max-w-md w-full border border-red-200`}>
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className={`text-xl font-semibold ${theme.text.primary} mb-2`}>Error Loading Report</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const score = matchedSubmission?.similarityScore || similarityScore;
  const scoreColor =
    score > 0.7 ? "bg-red-50 text-red-700 border-red-200" : score > 0.4 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-green-50 text-green-700 border-green-200";
  const riskText = score > 0.7 ? "High" : score > 0.4 ? "Medium" : "Low";
  const riskColor = score > 0.7 ? "text-red-600" : score > 0.4 ? "text-amber-600" : "text-green-600";

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      {/* Header */}
      <div className={`${theme.header} border-b shadow-sm sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${theme.text.primary}`}>Similarity Analysis Report</h1>
                <p className={`text-sm ${theme.text.secondary}`}>Detailed comparison and assessment</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <div className={`flex items-center gap-2 ${theme.card} border rounded-lg px-3 py-2`}>
                <Sun className={`w-4 h-4 ${!isDarkMode ? 'text-amber-500' : theme.text.muted}`} />
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <Moon className={`w-4 h-4 ${isDarkMode ? 'text-indigo-400' : theme.text.muted}`} />
              </div>
              
              <button
                onClick={() => navigate(-1)}
                className={`${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'} px-4 py-2 rounded-lg font-medium transition-colors duration-200 border`}
              >
                ← Back to Overview
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Assignment Information Card */}
          <div className={`${theme.card} rounded-lg shadow-sm border overflow-hidden`}>
            <div className={`bg-gradient-to-r ${theme.sectionGradient.primary} px-6 py-4`}>
              <div className="flex items-center gap-2 text-white">
                <BookOpen className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Assignment Details</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`text-sm font-medium ${theme.text.muted} block mb-1`}>Assignment Title</label>
                  <p className={`${theme.text.primary} font-medium`}>{assignment?.assignmentTitle || "N/A"}</p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${theme.text.muted} block mb-1`}>Similarity Score</label>
                  <div className={`inline-flex items-center px-4 py-2 rounded-lg border font-semibold ${scoreColor}`}>
                    {(score * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {["Original", "Matched"].map((type, idx) => {
              const sub = type === "Original" ? report?.originalSubmission : matchedSubmission;
              const link = type === "Original" ? originalLink : otherLink;
              const bgColor = type === "Original" ? theme.sectionGradient.primary : theme.sectionGradient.secondary;
              
              return (
                <div key={idx} className={`${theme.card} rounded-lg shadow-sm border overflow-hidden`}>
                  <div className={`bg-gradient-to-r ${bgColor} px-6 py-4`}>
                    <div className="flex items-center gap-2 text-white">
                      <Users className="w-5 h-5" />
                      <h2 className="text-lg font-semibold">{type} Submission</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    {sub?.student ? (
                      <div className="space-y-3">
                        <div>
                          <label className={`text-sm font-medium ${theme.text.muted} block mb-1`}>Student Name</label>
                          <p className={`${theme.text.primary} font-medium`}>{sub.student.name}</p>
                        </div>
                        <div>
                          <label className={`text-sm font-medium ${theme.text.muted} block mb-1`}>PRN</label>
                          <p className={theme.text.secondary}>{sub.student.prn}</p>
                        </div>
                        <div>
                          <label className={`text-sm font-medium ${theme.text.muted} block mb-1`}>Email</label>
                          <p className={`${theme.text.secondary} text-sm`}>{sub.student.email}</p>
                        </div>
                        {(sub?.pdfUrl || link) && (
                          <div className={`pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-slate-200'}`}>
                            <a
                              href={`https://docs.google.com/viewer?url=${encodeURIComponent(sub?.pdfUrl || link)}&embedded=true`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                            >
                              <FileText className="w-4 h-4" />
                              View Submission Document
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className={`${theme.text.muted} italic`}>Student information not available</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Text Comparison Section */}
          {report?.originalSubmission?.rawText && (
            <div className={`${theme.card} rounded-lg shadow-sm border overflow-hidden`}>
              <div className={`bg-gradient-to-r ${theme.sectionGradient.slate} px-6 py-4`}>
                <div className="flex items-center gap-2 text-white">
                  <FileText className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Text Content Comparison</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {["originalSubmission", "matchedSubmission"].map((key, idx) => {
                    const sub = key === "originalSubmission" ? report.originalSubmission : matchedSubmission;
                    const label = key === "originalSubmission" ? "Original" : "Matched";
                    const labelColor = key === "originalSubmission" 
                      ? (isDarkMode ? "bg-indigo-900/50 text-indigo-300 border-indigo-700" : "bg-indigo-100 text-indigo-700 border-indigo-200")
                      : (isDarkMode ? "bg-purple-900/50 text-purple-300 border-purple-700" : "bg-purple-100 text-purple-700 border-purple-200");
                    
                    return (
                      <div key={idx} className={`${theme.card} border rounded-lg overflow-hidden`}>
                        <div className={`${labelColor} px-4 py-2 font-medium text-sm border-b`}>
                          {label} Submission Text
                        </div>
                        <div className={`p-4 ${theme.textContent} max-h-96 overflow-y-auto`}>
                          <p className={`text-sm leading-relaxed whitespace-pre-wrap font-mono`}>
                            {sub?.rawText || "No text content available"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Matched Content Chunks */}
          <div className={`${theme.card} rounded-lg shadow-sm border overflow-hidden`}>
            <div className={`bg-gradient-to-r ${theme.sectionGradient.success} px-6 py-4`}>
              <div className="flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Similar Content Segments</h2>
              </div>
            </div>
            <div className="p-6">
              {!matchedSubmission?.matched_chunks?.length ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className={`${theme.text.secondary} font-medium`}>No significant matching content detected</p>
                  <p className={`${theme.text.muted} text-sm mt-1`}>These submissions appear to be unique</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matchedSubmission.matched_chunks.map((chunk, idx) => (
                    <div key={idx} className={`${theme.segment} border rounded-lg overflow-hidden hover:border-indigo-300 transition-colors duration-200`}>
                      <div className={`${theme.segmentHeader} px-4 py-2 border-b`}>
                        <span className={`text-sm font-semibold ${theme.text.secondary}`}>Segment {idx + 1}</span>
                      </div>
                      <div className="p-4">
                        <p className={`${theme.text.secondary} text-sm leading-relaxed`}>{chunk}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary Statistics */}
          <div className={`${theme.card} rounded-lg shadow-sm border overflow-hidden`}>
            <div className={`bg-gradient-to-r ${theme.sectionGradient.slate} px-6 py-4`}>
              <div className="flex items-center gap-2 text-white">
                <CheckCircle className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Analysis Summary</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`bg-gradient-to-br ${theme.summaryCard.primary} rounded-lg p-6 border`}>
                  <div className="text-center">
                    <p className={`text-sm font-medium ${theme.summaryText.primary} mb-2`}>Overall Similarity Score</p>
                    <p className={`text-4xl font-bold ${theme.summaryText.primaryBold}`}>{(score * 100).toFixed(1)}%</p>
                    <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-indigo-700' : 'border-indigo-200'}`}>
                      <span className={`text-sm font-semibold ${riskColor}`}>Risk Level: {riskText}</span>
                    </div>
                  </div>
                </div>
                <div className={`bg-gradient-to-br ${theme.summaryCard.success} rounded-lg p-6 border`}>
                  <div className="text-center">
                    <p className={`text-sm font-medium ${theme.summaryText.success} mb-2`}>Matched Content Segments</p>
                    <p className={`text-4xl font-bold ${theme.summaryText.successBold}`}>{matchedSubmission?.matched_chunks?.length || 0}</p>
                    <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-emerald-700' : 'border-emerald-200'}`}>
                      <span className={`text-sm font-medium ${theme.summaryText.success}`}>
                        {matchedSubmission?.matched_chunks?.length > 0 ? "Segments Identified" : "No Matches Found"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className={`${theme.infoBox} border rounded-lg p-4`}>
            <div className="flex gap-3">
              <AlertCircle className={`w-5 h-5 ${theme.infoText} flex-shrink-0 mt-0.5`} />
              <div>
                <p className={`text-sm font-medium ${theme.infoTextBold}`}>Analysis Information</p>
                <p className={`text-sm ${theme.infoText} mt-1`}>
                  This report provides an automated similarity analysis. Please review the matched segments carefully and consider the context before making any academic integrity decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareSimilarity;