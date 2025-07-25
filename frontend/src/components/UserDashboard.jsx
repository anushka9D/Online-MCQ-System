import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Clock, Users, PlayCircle, BarChart3, Eye, LogOut } from 'lucide-react';
import '../css/UserDashboard.css';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
const [particles, setParticles] = useState([]);
const { userid, name } = useParams();
const [examPapers, setExamPapers] = useState([]);
const [resultsHistory, setResults] = useState([]);
const [Examcount, setCount] = useState(0);

const navigate = useNavigate();

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
  const fetchExams = async () => {
    try {
      const response = await axios.get("http://localhost:8090/exams/");
      setExamPapers(response.data);
    } catch (error) {
      console.error("Failed to fetch exam papers:", error);
    }
  };

useEffect(() => {
  fetchExams();
}, []);

  // results history
    const fetchResults = async () => {
    try {
      const response = await axios.get(`http://localhost:8090/results/user/${userid}`);
      setResults(response.data.results);

    } catch (error) {
      console.error("Failed to fetch exam papers:", error);
    }
  };

useEffect(() => {
  fetchResults();
}, []);


// get Completed Exam count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get(`http://localhost:8090/results/count/${userid}`);
        setCount(res.data.total_results);
      } catch (err) {
        console.error('Failed to fetch result count:', err);
      }
    };

    fetchCount();
  }, [userid]);


  const handleAttemptQuiz = (paperid) => {
    navigate(`/exam/${paperid}/${userid}`);
  };

  const handleViewResult = (resultId) => {
    navigate(`/exam_result/${resultId}/${userid}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Logout function
  const handleLogout = () => {
    window.location.href = '/';
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
              <h1>Welcome back, {name}</h1>
              <p>Ready to continue your learning journey?</p>
            </div>
            <div className="user-stats">
              <div className="stat-item">
                <span className="stat-number">{Examcount}</span>
                <span className="stat-label">Completed Exam</span>
              </div>
            </div>
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Logout">
              <LogOut className="icon-sm" />
              Logout
            </button>
          </div>
        </div>

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
                      <span>10 min</span>
                    </div>
                    <div className="paper-info">
                      <Users className="icon-sm" />
                      <span>10 attempts</span>
                    </div>
                  </div>
                  
                  <button 
                    className="attempt-btn"
                    onClick={() => handleAttemptQuiz(paper._id)}>
                    <PlayCircle className="icon-md" />
                    Attempt Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results History Section */}
        <div className="results-section">
          <h2 className="section-title">
            <BarChart3 className="icon-lg text-blue" />
            Results History
          </h2>
          
          <div className="results-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Exam Name</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {resultsHistory.map((result) => (
                  <tr key={result.result_id}>
                    <td>
                      <div className="exam-name">{result.exam_title}</div>
                    </td>
                    <td>
                      <span className="score-badge">{result.score}</span>
                    </td>
                    <td>
                      <strong>{result.percentage}%</strong>
                    </td>
                    <td>
                      <span className="date-text">{formatDate(result.date)}</span>
                    </td>
                    <td>
                      <button 
                        className="view-btn"
                        onClick={() => handleViewResult(result.result_id)}
                      >
                        <Eye className="icon-sm" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;