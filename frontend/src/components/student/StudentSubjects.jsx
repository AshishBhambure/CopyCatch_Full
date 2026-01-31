import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentSubjects } from "../../services/apis";

const StudentSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      const data = await getStudentSubjects();
      setSubjects(data);
    };
    fetchSubjects();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Your Subjects</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <div
            key={subject._id}
            onClick={() => navigate(`/student/subject/${subject._id}`)}
            className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">{subject.subjectName}</h2>
            <p className="text-gray-500">Course: {subject.courseCode}</p>
            <p className="text-gray-500">
              Teacher: {subject.teacherId.name}
            </p>
            <p className="text-gray-400 text-sm">
              {subject.department} - {subject.year} Year
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentSubjects;
