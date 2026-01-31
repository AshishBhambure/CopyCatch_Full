import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import { getAssignmentsBySubject } from "../../services/apis";
import StudentNavbar from "./StudentNavbar";

const SubjectAssignments = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const assignments = await getAssignmentsBySubject(subjectId);
      setAssignments(assignments);
      console.log("Assignments fetched for subject:", assignments);
    };
    fetch();
  }, [subjectId]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-4">
      <StudentNavbar/>

    {/* Header Row */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-10">
        {/* Back Button - Left */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Heading - Center */}
        <h1 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 flex-1">
          📄 Assignments
        </h1>

        {/* Empty div for balancing layout */}
        <div className="w-[60px]" />
      </div>

      {assignments.length === 0 ? (
        <p className="text-gray-400 text-lg mt-10">
          No assignments found for this subject.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 mt-5 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-6xl">
          {assignments.map((a) => (
            <motion.div
              key={a._id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-800 hover:border-pink-500 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/assignment/${a._id}`)}
            >
              <div className="flex items-center mb-3">
                <FileText className="text-pink-500 mr-3" size={28} />
                <h2 className="text-xl font-semibold">{a.assignmentTitle}</h2>
              </div>

              {/* <a
                href={a.questionPaperLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-pink-400 hover:underline text-sm transition-colors duration-200"
              >
                View Question Paper →
              </a> */}
               <a
                href={`https://docs.google.com/viewer?url=${encodeURIComponent(a.questionPaperLink)}&embedded=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-pink-400 hover:underline text-sm transition-colors duration-200"
              >                View Question Paper →

              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectAssignments;
