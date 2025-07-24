import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Trophy, Target, Clock, User, Award } from 'lucide-react';
import '../css/Result.css';

const Result = () => {
  const { result_id, userid } = useParams(); 
  const navigate = useNavigate();
  const [animateScore, setAnimateScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [ResultData, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get result data
  const fetchResult = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8090/results/${result_id}`);
      setResults(response.data);
      
      // Animate score after data is loaded
      setTimeout(() => {
        setAnimateScore(response.data.percentage);
      }, 500);
      
    } catch (error) {
      console.error("Failed to fetch result:", error);
      setError("Failed to load result data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [result_id]);

  const getGradeIcon = (grade) => {
    switch(grade) {
      case 'A': return <Trophy className="grade-icon" />;
      case 'B': return <Award className="grade-icon" />;
      case 'C': return <Target className="grade-icon" />;
      default: return <XCircle className="grade-icon" />;
    }
  };

  const getGradeClass = (grade) => {
    switch(grade) {
      case 'A': return 'grade-a';
      case 'B': return 'grade-b';
      case 'C': return 'grade-c';
      default: return 'grade-f';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleProfileClick = () => {
    navigate(`/user_dashboard/${userid}/${ResultData.user.name}`);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Loading state
  if (loading) {
    return (
      <div className="result-container">
        <div className="result-content">
          <div className="loading-spinner">Loading results...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !ResultData) {
    return (
      <div className="result-container">
        <div className="result-content">
          <div className="error-message">
            <XCircle className="error-icon" />
            <p>{error || "Result not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="result-container">
      <div className="result-content">
        {/* Header */}
        <div className="result-header">
          <h1 className="result-title">Exam Results</h1>
          <p className="result-subtitle">Your performance analysis</p>
        </div>

        {/* Main Results Card */}
        <div className="main-result-card">
          <div className="result-grid">
            {/* Left Side - Score Circle */}
            <div className="score-section">
              <div className="score-circle-container">
                <svg className="score-circle-svg" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="score-circle-bg"/>
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="score-circle-progress"
                    strokeDasharray={`${animateScore * 2.83} 283`}
                  />
                </svg>
                <div className="score-content">
                  <div className="score-percentage">{Math.round(animateScore)}%</div>
                  <div className={`grade-badge ${getGradeClass(ResultData.grade)}`}>
                    {getGradeIcon(ResultData.grade)}
                    Grade {ResultData.grade}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="details-section">
              <div className="user-info">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                  alt="User" 
                  className="user-avatar"/>
                <div className="user-details">
                  <h3 className="user-name">{ResultData.user.name}</h3>
                  <p className="exam-title">{ResultData.exam.title}</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card correct">
                  <div className="stat-header">
                    <CheckCircle className="stat-icon" />
                    <span className="stat-label">Correct</span>
                  </div>
                  <div className="stat-value">{ResultData.correctAnswers}</div>
                </div>

                <div className="stat-card incorrect">
                  <div className="stat-header">
                    <XCircle className="stat-icon" />
                    <span className="stat-label">Incorrect</span>
                  </div>
                  <div className="stat-value">{ResultData.incorrectAnswers}</div>
                </div>

                <div className="stat-card total">
                  <div className="stat-header">
                    <Target className="stat-icon" />
                    <span className="stat-label">Total</span>
                  </div>
                  <div className="stat-value">{ResultData.totalQuestions}</div>
                </div>
              </div>

              <div className="timestamp-info">
                <Clock className="timestamp-icon" />
                <span>Completed on {formatDate(ResultData.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Details Button */}
        <div className="toggle-details">
          <button 
            className="btn btn-secondary"
            onClick={toggleDetails}
          >
            {showDetails ? 'Hide Question Review' : 'Show Question Review'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn btn-primary"
            onClick={handleProfileClick}>
            My Profile
          </button>
        </div>

        {/* Detailed Question Review */}
        <div className={`question-review ${showDetails ? 'show' : ''}`}>
          <h2 className="review-title">Question Review</h2>
          
          <div className="questions-list">
            {ResultData.answers.map((answer, index) => (
              <div 
                key={index}
                className={`question-card ${answer.is_correct ? 'correct' : 'incorrect'}`}
              >
                <div className="question-content">
                  <div className={`question-status ${answer.is_correct ? 'correct' : 'incorrect'}`}>
                    {answer.is_correct ? (
                      <CheckCircle className="status-icon" />
                    ) : (
                      <XCircle className="status-icon" />
                    )}
                  </div>
                  
                  <div className="question-details">
                    <div className="question-badges">
                      <span className="question-number">Question {index + 1}</span>
                      <span className={`result-badge ${answer.is_correct ? 'correct' : 'incorrect'}`}>
                        {answer.is_correct ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    
                    <h4 className="question-text">{answer.question_text}</h4>
                    
                    <div className="options-list">
                      {answer.options.map((option, optionIndex) => (
                        <div 
                          key={optionIndex}
                          className={`option ${
                            option === answer.correct_option && option === answer.selected_option
                                ? 'correct-selected'
                                : option === answer.correct_option
                                ? 'correct-answer'
                                : option === answer.selected_option
                                ? 'wrong-selected'
                                : 'default'
                            }`}>

                          <div className="option-content">
                            <span className="option-letter">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>
                            <span className="option-text">{option}</span>
                            {option === answer.selected_option && (
                              <span className="option-label">Your Answer</span>
                            )}
                            {option === answer.correct_option && (
                              <span className="option-label">Correct Answer</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;