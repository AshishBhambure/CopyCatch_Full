import axios from "axios";
import {adminBaseUrl, assignmentBaseUrl, baseUrl, similarityBaseUrl, studentBaseUrl, submissionBaseUrl, teacherBaseUrl} from "./baseUrl";


export const getTeacherSubjects = async (teacherId) => {
    try{
        const url = teacherBaseUrl + `/${teacherId}/subjects`;
        console.log("URL" , url);
        const token = localStorage.getItem("token");
        const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(res);
        return res.data;
    }
    catch(e){
        console.error("Error fetching subjects:", e);
    }
}


export const createAssignment = async (assignmentData) => {
  try {
    const token = localStorage.getItem("token");
    const url = `${assignmentBaseUrl}/create`;

    // Create form data since file upload is required
    const formData = new FormData();
    formData.append("subjectId", assignmentData.subjectId);
    formData.append("assignmentTitle", assignmentData.assignmentTitle);
    formData.append("minMatchLength", assignmentData.minMatchLength);
    formData.append("file", assignmentData.questionPaperLink); // File object (from input type="file")
console.log("assignment data", formData)
    const res = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Assignment created successfully:", res);
    return res.data;
  } catch (error) {
    console.error(
      "Error creating assignment:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Update Assignment
export const updateAssignment = async (id, assignmentData) => {
  try {
    const token = localStorage.getItem("token");
    const url = `${assignmentBaseUrl}/${id}`;

    const formData = new FormData();
    if (assignmentData.assignmentTitle)
      formData.append("assignmentTitle", assignmentData.assignmentTitle);
    if (assignmentData.minMatchLength)
      formData.append("minMatchLength", assignmentData.minMatchLength);
    if (assignmentData.questionPaperLink instanceof File)
      formData.append("file", assignmentData.questionPaperLink);

    const res = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.assignment;
  } catch (error) {
    console.error("Error updating assignment:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Delete Assignment
export const deleteAssignment = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const url = `${assignmentBaseUrl}/${id}`;

    const res = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error deleting assignment:", error.response?.data || error.message);
    throw error;
  }
};

export const getAssignmentsBySubject = async (subjectId) => {
  try {
    const token = localStorage.getItem("token");
    const url = `${assignmentBaseUrl}/subject/${subjectId}/assignments`;

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Assignments fetched successfully:", res.data);
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error(
      "Error fetching assignments:",
      error.response?.data || error.message
    );
    return [];
  }
};


// student all APIs

// ✅ Get student profile
export const getStudentProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${studentBaseUrl}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.student;
};

export const getStudentById = async (studentId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${studentBaseUrl}/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("get Student res: ", res);
    return res.data.student;
  } catch (error) {
    console.error("Error fetching student:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Update Year in Student Profile
export const updateStudentYear = async (year) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${studentBaseUrl}/update-year`,
      { year },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating year:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Fetch Subjects for Logged-in Student
export const getStudentSubjects = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${studentBaseUrl}/subjects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching subjects:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Fetch Assignments for Subject
export const getAssignmentsBySubjectForStudent = async (subjectId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${studentBaseUrl}/subject/${subjectId}/assignments`, {
      headers: { Authorization: `Bearer ${token}` },
  
    }); console.log("Assignments for student fetched:", res.data);
    return res.data;

  } catch (error) {
    console.error("Error fetching assignments:", error.response?.data || error.message);
    throw error;
  }
};

// get student by submission id 

export const getStudentbySubmissionId = async (submissionId) => {
  try{
      const res = await axios.get(`${submissionBaseUrl}/${submissionId}/student`);

    return res.data; 
  } catch (error) {
    console.error(
      "Error fetching Student:",
      error.response?.data || error.message
    );
    throw error;
  }
}
// get subject by ID

export const getSubjectbyId = async(subjectId) => {
try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${teacherBaseUrl}/subject/${subjectId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Subject report fetched:", res.data);

    return res.data; 
  } catch (error) {
    console.error(
      "Error fetching Subject:",
      error.response?.data || error.message
    );
    throw error;
  }
}


// ✅ Create new submission (First-time)
export const createSubmission = async (assignmentId, file) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignmentId", assignmentId); // ✅ Send this to backend


    const res = await axios.post(`${submissionBaseUrl}/submit`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating submission:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Update Submission
export const updateSubmission = async (submissionId, file) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(`${submissionBaseUrl}/${submissionId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating submission:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Delete Submission
export const deleteSubmission = async (submissionId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${submissionBaseUrl}/${submissionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting submission:", error.response?.data || error.message);
    throw error;
  }
};


export const getAssignmentById = async (assignmentId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${assignmentBaseUrl}/${assignmentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching assignment:", error.response?.data || error.message);
    throw error;
  }
};

export const getSubmissionsByAssignment = async (assignmentId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${submissionBaseUrl}/${assignmentId}/submission`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("res for getSubmissionByAssignmentAndStudent:", res);
    return res.data;
  } catch (error) {
    console.error("Error fetching submissions:", error.response?.data || error.message);
    throw error;
  }
};


// ✅ Get all submissions for a specific assignment
export const getAllSubmissionsForAssignment = async (assignmentId) => {
  try {
    const token = localStorage.getItem("token"); // get JWT token
    const res = await axios.get(`${teacherBaseUrl}/assignment/${assignmentId}/submissions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data; // returns array of submissions
  } catch (error) {
    console.error("Error fetching submissions:", error.response?.data || error.message);
    throw error;
  }
};


export const getSimilarityReportBySubmission = async (submissionId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${similarityBaseUrl}/submission/${submissionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Similarity report fetched:", res.data);

    return res.data; // contains the similarity report
  } catch (error) {
    console.error(
      "Error fetching similarity report:",
      error.response?.data || error.message
    );
    throw error;
  }
};



export const getEnhancedSimilarityReport = async (submissionId) => {
  // console.log("Fetching enhanced similarity report for submissionId:", submissionId);
  try {
    const token = localStorage.getItem("token");

    // 1️⃣ Fetch similarity report
    const reportRes = await axios.get(
      `${similarityBaseUrl}/report/${submissionId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
// console.log("Report Res:", reportRes);
    const report = reportRes.data;
    if (!report) return null;
    console.log("Similarity report:", report);
    // 2️⃣ Fetch student info for original submission (optional, already included in backend)


    return report;
  }  catch (err) {
    console.error(
      "Error in getEnhancedSimilarityReport:",  
      err.response?.data || err.message
    );
    throw err;
  }
};








// ================= Teacher APIs =================

// ADMIN API's

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Create teacher
export const createTeacher = async (teacherData) => {
  const res = await axios.post(`${adminBaseUrl}/teacher/create`, teacherData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};


// Get all teachers
export const getTeachers = async () => {
  const res = await axios.get(`${adminBaseUrl}/teacher/all`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Create subject
export const createSubject = async (subjectData) => {
  const res = await axios.post(`${adminBaseUrl}/subject/create`, subjectData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Get all subjects
export const getSubjects = async () => {
  const res = await axios.get(`${adminBaseUrl}/subject/all`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};


// Update teacher
export const updateTeacher = async (teacherId, updatedData) => {
  const res = await axios.post(
    `${adminBaseUrl}/teacher/update/${teacherId}`,
    updatedData,
    {
      headers: getAuthHeaders(),
    }
  );
  return res.data;
};

export const getTeacherProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${teacherBaseUrl}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.teacher;
};

// Delete teacher
export const deleteTeacher = async (teacherId) => {
  const res = await axios.delete(
    `${adminBaseUrl}/teacher/delete/${teacherId}`,
    {
      headers: getAuthHeaders(),
    }
  );
  return res.data;
};

// Update subject
export const updateSubject = async (subjectId, updatedData) => {
  const res = await axios.post(
    `${adminBaseUrl}/subject/update/${subjectId}`,
    updatedData,
    {
      headers: getAuthHeaders(),
    }
  );
  return res.data;
};

// Delete subject
export const deleteSubject = async (subjectId) => {
  const res = await axios.delete(
    `${adminBaseUrl}/subject/delete/${subjectId}`,
    {
      headers: getAuthHeaders(),
    }
  );
  return res.data;
};

