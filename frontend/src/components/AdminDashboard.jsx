import { useState, useEffect } from 'react';
import { BookOpen, Clock, Users, Trash, Plus, X } from 'lucide-react';
import '../css/AdminDashboard.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
const [particles, setParticles] = useState([]);
const [examPapers, setExamPapers] = useState([]);
const [showAddExam, setShowAddExam] = useState(false);
const [showAddQuestions, setShowAddQuestions] = useState(false);
const [selectedExamId, setSelectedExamId] = useState('');
const [newExam, setNewExam] = useState({ title: '', description: '' });
const [questions, setQuestions] = useState([{ question_text: '', options: ['', '', '', ''], correct_option: '' }]);

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    setParticles(newParticles);
  }, []);

  // Animate
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y <= -5 ? 105 : particle.y - particle.speed * 0.05
      })));
    }, 100);
    return () => clearInterval(interval);
  }, []);

// Get all exam
useEffect(() => {
  const fetchExams = async () => {
    try {
      const response = await axios.get("http://localhost:8090/exams/");
      setExamPapers(response.data);
    } catch (error) {
      console.error("Failed to fetch exam papers:", error);
    }
  };

  fetchExams();
}, []);

// delete Quiz
const handleDeleteQuiz = (paperId) => {
    console.log(`Attempting quiz with ID: ${paperId}`);
    // quiz attempt
};

// Add exam 
const handleAddExam = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:8090/exams/", newExam);
    setExamPapers([...examPapers, response.data]);
    setNewExam({ title: '', description: '' });
    setShowAddExam(false);
        Swal.fire({
        title: "Exam Created successfull!",
        icon: "success",
        draggable: true
        });
  } catch (error) {
    console.error("Failed to create exam:", error);
        Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!"
        });
  }
};

// Add Qusetion
const handleAddQuestions = async (e) => {
  e.preventDefault();
  if (!selectedExamId) {
    Swal.fire("Please select an exam first.");
    return;
  }

  const questionsWithExamId = questions.map(q => ({
    ...q,
    exam_id: selectedExamId
  }));

  try {
    await axios.post("http://localhost:8090/exams/questions", questionsWithExamId);
    setQuestions([{ question_text: '', options: ['', '', '', ''], correct_option: '' }]);
    setSelectedExamId('');
    setShowAddQuestions(false);
        Swal.fire({
        title: "Questions added successfully!",
        icon: "success",
        draggable: true
        });

  } catch (error) {
    console.error("Failed to add questions:", error);
        Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add questions. Please try again.",
        });
  }
};

const addQuestion = () => {
  setQuestions([...questions, { question_text: '', options: ['', '', '', ''], correct_option: '' }]);
};

const removeQuestion = (index) => {
  if (questions.length > 1) {
    setQuestions(questions.filter((_, i) => i !== index));
  }
};

const updateQuestion = (index, field, value) => {
  const updated = [...questions];
  updated[index][field] = value;
  setQuestions(updated);
};

const updateOption = (questionIndex, optionIndex, value) => {
  const updated = [...questions];
  updated[questionIndex].options[optionIndex] = value;
  setQuestions(updated);
};

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        
        {/* Background Effects */}
        <div className="bg-effects">
            {/* Gradient Background */}
            <div className="gradient-bg" />
            
            {/* Floating Particles */}
            {particles.map(particle => (
            <div
                key={particle.id}
                className="particle animate-pulse"
                style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity
                }}/>
            
            ))}
            
            {/* Geometric Shapes */}
            <div className="geometric-shape-1" />
            <div className="geometric-shape-2" />
            <div className="geometric-shape-3" />
        </div>

        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1>Welcome back, Admin</h1>
              <p>Manage your System</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
        <button 
            className="action-btn add-exam-btn"
            onClick={() => setShowAddExam(true)}>
            <Plus className="icon-sm" />
            Add New Exam
        </button>

        <button 
            className="action-btn add-questions-btn"
            onClick={() => setShowAddQuestions(true)}>
            <Plus className="icon-sm" />
            Add Questions
        </button>
        </div>

        {/* Add Exam  */}
        {showAddExam && (
        <div className="modal-overlay">
            <div className="modal">
            <div className="modal-header">
                <h3>Add New Exam</h3>
                <button 
                className="close-btn"
                onClick={() => setShowAddExam(false)}>
                
                <X className="icon-sm" />
                </button>
            </div>
            <form onSubmit={handleAddExam} className="modal-form">
                <div className="form-group">
                <label>Exam Title</label>
                <input
                    type="text"
                    value={newExam.title}
                    onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                    required
                    placeholder="Enter exam title"/>
                
                </div>
                <div className="form-group">
                <label>Description</label>
                <textarea
                    value={newExam.description}
                    onChange={(e) => setNewExam({...newExam, description: e.target.value})}
                    required
                    placeholder="Enter exam description"
                    rows="3"/>
                
                </div>
                <div className="modal-actions">
                <button type="button" onClick={() => setShowAddExam(false)} className="cancel-btn">
                    Cancel
                </button>
                <button type="submit" className="submit-btn">
                    Create Exam
                </button>
                </div>
            </form>
            </div>
        </div>
        )}

        {/* Add Questions */}
        {showAddQuestions && (
        <div className="modal-overlay">
            <div className="modal large-modal">
            <div className="modal-header">
                <h3>Add Questions</h3>
                <button 
                className="close-btn"
                onClick={() => setShowAddQuestions(false)}>
                
                <X className="icon-sm" />
                </button>
            </div>
            <form onSubmit={handleAddQuestions} className="modal-form">
                <div className="form-group">
                <label>Select Exam</label>
                <select
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    required>
                
                    <option value="">Choose an exam...</option>
                    {examPapers.map(exam => (
                    <option key={exam._id} value={exam._id}>
                        {exam.title}
                    </option>
                    ))}
                </select>
                </div>

                {questions.map((question, qIndex) => (
                <div key={qIndex} className="question-block">
                    <div className="question-header">
                    <h4>Question {qIndex + 1}</h4>
                    {questions.length > 1 && (
                        <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="remove-question-btn">
                        <X className="icon-sm" />
                        </button>
                    )}
                    </div>
                    
                    <div className="form-group">
                    <label>Question Text</label>
                    <input
                        type="text"
                        value={question.question_text}
                        onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                        required
                        placeholder="Enter question text"/>
                    </div>

                    <div className="options-group">
                    <label>Options</label>
                    {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="option-input">
                        <span className="option-label">{String.fromCharCode(65 + oIndex)}.</span>
                        <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            required
                            placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}/>
                        </div>
                    ))}
                    </div>

                    <div className="form-group">
                    <label>Correct Answer</label>
                    <select
                        value={question.correct_option}
                        onChange={(e) => updateQuestion(qIndex, 'correct_option', e.target.value)}
                        required>

                        <option value="">Select correct answer...</option>
                        {question.options.map((option, oIndex) => (
                        <option key={oIndex} value={option}>
                            {String.fromCharCode(65 + oIndex)}. {option}
                        </option>
                        ))}
                    </select>
                    </div>
                </div>
                ))}

                <button
                type="button"
                onClick={addQuestion}
                className="add-question-btn">
                <Plus className="icon-sm" />
                Add Another Question
                </button>

                <div className="modal-actions">
                <button type="button" onClick={() => setShowAddQuestions(false)} className="cancel-btn">
                    Cancel
                </button>
                <button type="submit" className="submit-btn">
                    Add Questions
                </button>
                </div>
            </form>
            </div>
        </div>
        )}

        {/* Exam Papers Section */}
        <div className="exam-papers-section">
          <h2 className="section-title">
            <BookOpen className="icon-lg text-purple" />
            Available Exam Papers
          </h2>
          
          <div className="papers-grid">
            {examPapers.map((paper) => (
              <div key={paper.id} className="paper-card">
                <img 
                  src="https://assets.goodfirms.co/blog/general/1566798061-exam-online.jpg"
                  alt={paper.title}
                  className="paper-image"/>

                <div className="paper-content">
                  <h3 className="paper-title">{paper.title}</h3>
                  <p className="paper-description">{paper.description}</p>
                  
                  <div className="paper-meta">
                    <div className="paper-info">
                      <BookOpen className="icon-sm" />
                      <span>5 Questions</span>
                    </div>
                    <div className="paper-info">
                      <Clock className="icon-sm" />
                      <span>20 min</span>
                    </div>
                    <div className="paper-info">
                      <Users className="icon-sm" />
                      <span>10 attempts</span>
                    </div>
                  </div>
                  
                  <button 
                    className="deleteQuiz-btn"
                    onClick={() => handleDeleteQuiz(paper.id)}>
                    <Trash  className="icon-md" />
                    Delete Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;