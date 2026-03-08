import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getAllSubmissionsForAssignment } from "../../services/apis";
import { ArrowRight, Search } from "lucide-react";
import Footer from "../ad-hoc/Footer";

const ViewSubmissions = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const submissions = await getAllSubmissionsForAssignment(assignmentId);
      console.log("Submissions fetched:", submissions);
      setSubmissions(submissions);
    };
    fetch();
  }, [assignmentId]);

  /* ---------- FILTERING LOGIC ---------- */

  const filteredSubmissions = useMemo(() => {

    if (!search) return submissions;

    const q = search.toLowerCase();

    return submissions.filter((s) => {

      const name =
        String(s?.studentId?.name ?? "").toLowerCase();

      const prn =
        String(s?.studentId?.prn ?? "").toLowerCase();

      const version =
        String(s?.version ?? 1).toLowerCase();

      return (
        name.includes(q) ||
        prn.includes(q) ||
        version.includes(q)
      );

    });

  }, [search, submissions]);
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Header */}

      <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <Link className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              CopyCatch
            </h1>
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-xl font-semibold hover:scale-105 hover:shadow-xl transition"
          >
            ← Back
          </button>

        </div>
      </header>

      {/* Hero */}

      <section className="text-center py-12 px-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Submissions
        </h1>

        <p className="text-gray-400 text-lg mt-5">
          View all student submissions and quickly detect plagiarism.
        </p>
      </section>

      {/* SEARCH BAR */}

      <div className="max-w-7xl mx-auto px-6 mb-6 w-full">

        <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 shadow-md">

          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search by Name, PRN, or Version..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-gray-200 placeholder-gray-500"
          />

        </div>

      </div>

      {/* TABLE */}

      <main className="max-w-7xl mx-auto px-6 pb-16 flex-1 w-full">

        {filteredSubmissions.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">
            No submissions found.
          </p>
        ) : (

          <div className="overflow-x-auto border border-gray-800 rounded-2xl">

            <table className="w-full text-left">

              {/* TABLE HEADER */}

              <thead className="bg-gray-900 text-gray-300">

                <tr>

                  <th className="p-4">Student Name</th>
                  <th className="p-4">PRN</th>
                  <th className="p-4">Version</th>
                  <th className="p-4">Submitted At</th>
                  <th className="p-4">Submission</th>
                  <th className="p-4">Plagiarism</th>

                </tr>

              </thead>

              {/* TABLE BODY */}

              <tbody>

                {filteredSubmissions.map((s) => (

                  <tr
                    key={s._id}
                    className="border-t border-gray-800 hover:bg-gray-900/60 transition"
                  >

                    {/* Student Name */}

                    <td className="p-4 font-semibold text-white">
                      {s.studentId?.name || "Unknown"}
                    </td>

                    {/* PRN */}

                    <td className="p-4">
                      <span className="bg-gray-200 text-black px-2 py-1 rounded">
                        {s.studentId?.prn || "N/A"}
                      </span>
                    </td>

                    {/* Version */}

                    <td className="p-4">
                      <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-lg">
                        v{s.version || 1}
                      </span>
                    </td>

                    {/* Submitted At */}

                    <td className="p-4 text-gray-400">
                      {new Date(s.submittedAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* View Submission */}

                    <td className="p-4">

                      <a
                        href={`https://docs.google.com/viewer?url=${encodeURIComponent(
                          s.submissionLink
                        )}&embedded=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-500 hover:underline font-semibold"
                      >
                        View
                      </a>

                    </td>

                    {/* Check Plag */}

                    <td className="p-4">

                      <button
                        onClick={() =>
                          navigate(
                            `/check-similar-documents/${assignmentId}/${s._id}`
                          )
                        }
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-2 rounded-lg hover:scale-105 transition"
                      >
                        Check
                        <ArrowRight size={16} />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

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