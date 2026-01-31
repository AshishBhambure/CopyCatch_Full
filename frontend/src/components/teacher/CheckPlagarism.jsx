import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getAssignmentsBySubject, getSubjectbyId } from "../../services/apis";
import { ArrowRight } from "lucide-react";
import Footer from "../ad-hoc/Footer";

const CheckPlagiarism = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getAssignmentsBySubject(subjectId);
      setAssignments(data);
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              CopyCatch
            </h1>
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-xl font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            ← Back
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-16 px-6">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Check Plagiarism - {subject?.subjectName || ""}
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mt-5 py-5">
          View assignments for this subject and analyze plagiarism easily.
        </p>
      </section>

      {/* Assignments Grid */}
      <main className="px-6 pb-16 flex-1">
        {assignments.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">
            No assignments found for this subject.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assignments.map((a) => (
              <div
                key={a._id}
                className="p-6 rounded-2xl backdrop-blur-md bg-gray-900/70 shadow-lg border border-gray-800 hover:border-pink-500 hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {a.assignmentTitle}
                </h2>
                <p className="text-gray-400 mt-2">
                  Min Match Length: {a.minMatchLength}
                </p>
                <a
                  href={a.questionPaperLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-pink-500 hover:underline font-semibold"
                >
                  View Question Paper
                </a>
                <button
                  onClick={() => navigate(`/view-submissions/${a._id}`)}
                  className="mt-6 flex items-center gap-2 justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:scale-105 hover:shadow-xl transition duration-200"
                >
                  View Submissions <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto backdrop-blur-md bg-gray-900/80">
        <Footer />
      </footer>
    </div>
  );
};

export default CheckPlagiarism;
