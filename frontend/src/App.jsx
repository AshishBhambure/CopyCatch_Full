import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/ad-hoc/Home';
import StudentSubjects from './components/student/StudentSubjects';
import SubjectAssignments from './components/student/SubjectAssignments';
import AssignmentDetails from './components/student/AssignmentDetails';
import SignupForm from './components/ad-hoc/Signup';
import LoginForm from './components/ad-hoc/Login';
import TeacherSubjects from './components/teacher/TeacherSubjects';
import AddAssignment from './components/teacher/AddAssignment ';
import CheckPlagiarism from './components/teacher/CheckPlagarism';
import ViewSubmissions from './components/teacher/ViewSubmissions';
import Profile from './components/student/Profile';
import StudentDashboard from './components/student/StudentDashboard';
import CheckSimilarDocuments from './components/teacher/checkSimilarDocuments';
import CompareSimilarity from './components/teacher/CompareSimilarity';
import AdminDashboard from './components/admin/AdminDashboard';
import ForgotPassword from './components/ad-hoc/ForgotPassword';

function App() {
  return (
    <Routes>
      <Route path='/' element = {<Home/>} />
      <Route path='/login' element={<LoginForm/>}/>
      <Route path='/signup' element={<SignupForm/>}/>
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path='/student-subjects' element={<StudentSubjects/>}/>
      {/* <Route path='/singup' element={<SignupForm/>}/> */}
      <Route path='/subjectAssignments/:subjectId' element={<SubjectAssignments />} />
      <Route path='/assignment/:assignmentId' element={<AssignmentDetails/>} />
      <Route path='/assignmentDetails/:assignmentId' element={<AssignmentDetails />} /> {/* ← new route */}
      <Route path="/student/profile" element={<Profile />} />
      <Route path="/student/subjects" element={<StudentSubjects />} />
      <Route path="/student/subject/:subjectId" element={<SubjectAssignments />} />

      
      {/*  Teacher Routes */}
      <Route path='/teacher-subjects' element={<TeacherSubjects/>} />
      
      <Route path='/add-assignment/:subjectId' element={<AddAssignment/>} />

      <Route path='/check-plagiarism/:subjectId' element={<CheckPlagiarism/>} />
      <Route path='/view-submissions/:assignmentId' element={<ViewSubmissions/>}/>
      <Route path = '/check-similar-documents/:assignmentId/:submissionId' element={<CheckSimilarDocuments/>}></Route>
      <Route
          path="/compare-documents/:assignmentId/:submissionId/:otherSubmissionId"
          element={<CompareSimilarity />}
        />
        <Route path='/admin-dashboard' element={<AdminDashboard/>} />
        
        <Route
         path='/forgot-pass'
         element={<ForgotPassword/>}
        ></Route>
    </Routes>
  );
}

export default App;
