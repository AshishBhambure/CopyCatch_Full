import Subject from '../models/Subject.js';

// Create subject
export const createSubject = async (req, res) => {
    try {
        const subject = new Subject(req.body);
        await subject.save();
        res.status(201).json({ message: 'Subject created', subject });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all subjects
export const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().populate('teacherId', 'name email');
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get subject by ID
export const getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id).populate('teacherId', 'name email');
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
