import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getAllSubmissionsForAssignment } from "../../services/apis";
import { ArrowRight } from "lucide-react";
import Footer from "../ad-hoc/Footer";

const ViewSubmissions = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const submissions = await getAllSubmissionsForAssignment(assignmentId);
      console.log("Submissions fetched:", submissions);
      setSubmissions(submissions);
    };
    fetch();
  }, [assignmentId]);

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
          Submissions
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mt-5 py-5">
          View all student submissions for this assignment and check plagiarism easily.
        </p>
      </section>

      {/* Submissions Grid */}
      <main className="px-6 pb-16 flex-1">
        {submissions.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">
            No submissions found for this assignment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {submissions.map((s) => (
              <div
                key={s._id}
                className="p-6 rounded-2xl backdrop-blur-md bg-gray-900/70 shadow-lg border border-gray-800 hover:border-pink-500 hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <p className="text-white font-semibold text-lg">
                  Student Name: {s.studentId?.name || "Unknown Student"}
                </p>
                <p className="text-gray-400 mt-2">
                  Submitted At: {new Date(s.submittedAt).toLocaleString()}
                </p>
                {/* <a
                  href={s.submissionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-pink-500 hover:underline font-semibold"
                >
                  View Submission
                </a> */}

                 <a
                href={`https://docs.google.com/viewer?url=${encodeURIComponent(s.submissionLink)}&embedded=true`}
                target="_blank"
                rel="noopener noreferrer"
                  className="inline-block mt-4 text-pink-500 hover:underline font-semibold"
              >                View Submission

              </a>
                <button
                  onClick={() => navigate(`/check-similar-documents/${assignmentId}/${s._id}`)}
                  className="mt-6 flex items-center gap-2 justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:scale-105 hover:shadow-xl transition duration-200"
                >
                  Check Plag <ArrowRight size={18} />
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

export default ViewSubmissions;
