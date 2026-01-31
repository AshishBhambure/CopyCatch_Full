import Assignment from '../models/Assignment.js';
import Subject from '../models/Subject.js';
import Submission from '../models/Submission.js';

// Get assignments for a subject
export const getAssignmentsBySubject = async (req, res) => {
  try {
    const assignments = await Assignment.find({ subjectId: req.params.subjectId });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAssignment = async (req, res) => {
  try {
    console.log("Hello1")
    const { subjectId, assignmentTitle, minMatchLength } = req.body;
    console.log("Creating assignment for subject:", subjectId, "Title:", assignmentTitle);
    
    const subject = await Subject.findById(subjectId);
    if(!subject) return res.status(404).json({ message: 'Subject not found' });
    console.log("Hello2")

    // Teacher authorization
    if(req.user.role === 'teacher' && subject.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this subject' });
    }
    console.log("Hello3")


    // req.file.path will now be the Cloudinary URL
    const questionPaperLink = req.file ? req.file.path : null;
    if(!questionPaperLink) return res.status(400).json({ message: 'Question file required' });
console.log("File uploaded to:", questionPaperLink);
    const assignment = new Assignment({
      subjectId,
      assignmentTitle,
      minMatchLength,
      questionPaperLink
    });

    await assignment.save();
    res.status(201).json({ assignment });
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
};

// -------------------- UPDATE ASSIGNMENT --------------------
export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignmentTitle, minMatchLength } = req.body;

    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Check teacher authorization
    const subject = await Subject.findById(assignment.subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    if (req.user.role === 'teacher' && subject.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this subject' });
    }

    // Update fields
    if (assignmentTitle) assignment.assignmentTitle = assignmentTitle;
    if (minMatchLength) assignment.minMatchLength = minMatchLength;
    if (req.file) assignment.questionPaperLink = req.file.path; // new uploaded file

    await assignment.save();
    res.status(200).json({ message: 'Assignment updated successfully', assignment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// -------------------- DELETE ASSIGNMENT --------------------
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const subject = await Subject.findById(assignment.subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    // Only the assigned teacher can delete
    if (req.user.role === 'teacher' && subject.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this subject' });
    }

    await assignment.deleteOne();
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get submissions for an assignment
export const getSubmissionsByAssignment = async (req, res) => {
    try {
        const submissions = await Submission.find({ assignmentId: req.params.assignmentId })
            .populate('studentId', 'name email');
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// get single assignment by id
export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
