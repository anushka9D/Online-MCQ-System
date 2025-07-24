import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Clock, BarChart3, CheckCircle } from 'lucide-react';
import '../css/Exam.css';
import Swal from 'sweetalert2';

const Exam = () => {
  const { paperid, userid } = useParams();
  const Examid = paperid;

  const navigate = useNavigate();
  
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // exam and questions
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        // Fetch exam details
        const examResponse = await axios.get(`http://localhost:8090/exams/exam/${Examid}`);
        setExam(examResponse.data);

        // Fetch questions for exam
        const questionsResponse = await axios.get(`http://localhost:8090/exams/${Examid}`);
        setQuestions(questionsResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch exam data:", error);
        Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to load exam. Please try again!"
                });
        navigate('/login');
      }
    };

    if (Examid) {
      fetchExamData();
    }
  }, [Examid, navigate]);

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitting) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitExam();
    }
  }, [timeLeft, isSubmitting]);

  // time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer
    }));
  };

  // Submit exam
  const handleSubmitExam = async () => {
    if (isSubmitting) return;

    // Check for unanswered questions
    const unansweredQuestions = questions.filter(q => !answers[q._id]);

    if (unansweredQuestions.length > 0) {
        Swal.fire({
        icon: 'warning',
        title: 'Incomplete Exam',
        text: `You have ${unansweredQuestions.length} unanswered question(s). Please answer all before submitting.`,
        });

        // Scroll to the first unanswered question
        const firstUnansweredIndex = questions.findIndex(q => !answers[q._id]);
        setCurrentQuestion(firstUnansweredIndex);

        return;
    }
    
    setIsSubmitting(true);
    
    try {
      const examResult = {
        user_id: userid,
        exam_id: Examid,
        useranswers:answers,
        timestamp: new Date()
      };

      const response = await axios.post('http://localhost:8090/results/', examResult);
      
      const { result_id } = response.data;
      navigate(`/exam_result/${result_id}/${userid}`);

    } catch (error) {
      console.error("Failed to submit exam:", error);
      Swal.fire({
        icon: 'error',
        title: 'Submission failed',
        text: 'Please try again later.'
        });
      setIsSubmitting(false);
    }
  };

  // Navigation functions
  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="bg-effects">
            <div className="gradient-bg" />
          </div>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading exam...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="dashboard">
      <div className="dashboard-container">

        {/* Exam Header */}
        <div className="exam-header">
          <div className="exam-info">
            <h1 className="exam-title">
              <BookOpen className="icon-lg" />
              {exam?.title}
            </h1>
            <p className="exam-description">{exam?.description}</p>
          </div>
          
          <div className="exam-stats">
            <div className="stat-card timer-card">
              <Clock className="icon-md" />
              <div>
                <div className="stat-value time-left">{formatTime(timeLeft)}</div>
                <div className="stat-label">Time Remaining</div>
              </div>
            </div>
            
            <div className="stat-card">
              <BarChart3 className="icon-md" />
              <div>
                <div className="stat-value">{answeredCount}/{questions.length}</div>
                <div className="stat-label">Answered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}>
            </div>
          </div>
          <span className="progress-text">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>

        {/* Question Navigation */}
        <div className="question-nav">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === currentQuestion ? 'active' : ''} ${
                answers[questions[index]._id] ? 'answered' : ''
              }`}
              onClick={() => goToQuestion(index)}>
            
              {index + 1}
            </button>
          ))}
        </div>

        {/* Current Question */}
        {currentQ && (
          <div className="question-container">
            <div className="question-card">
              <div className="exam-question-header">
                <h2 className="exam-question-number">Question {currentQuestion + 1}</h2>
                {answers[currentQ._id] && (
                  <CheckCircle className="icon-sm answered-icon" />
                )}
              </div>
              
              <div className="exam-question-text">
                {currentQ.question_text}
              </div>
              
              <div className="options-container">
                {currentQ.options.map((option, index) => (
                  <label 
                    key={index}
                    className={`exam-option-label ${
                      answers[currentQ._id] === option ? 'selected' : ''
                    }`}>
                  
                    <input
                      type="radio"
                      name={`question-${currentQ._id}`}
                      value={option}
                      checked={answers[currentQ._id] === option}
                      onChange={() => handleAnswerSelect(currentQ._id, option)}/>
                    
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="option-text">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="exam-controls">
          <button 
            className="control-btn prev-btn"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}>
          
            Previous
          </button>
          
          <div className="control-center">
            {currentQuestion === questions.length - 1 ? (
              <button 
                className="control-btn submit-btn"
                onClick={handleSubmitExam}
                disabled={isSubmitting}>

                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
              </button>
            ) : (
              <button 
                className="control-btn next-btn"
                onClick={nextQuestion}>
                Next
              </button>
            )}
          </div>
          
          <div className="question-counter">
            {currentQuestion + 1} / {questions.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;