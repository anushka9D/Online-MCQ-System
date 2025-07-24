import { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, BookOpen, Trophy, Users, Brain } from 'lucide-react';
import '../css/Login.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [particles, setParticles] = useState([]);

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
        y: particle.y <= -10 ? 110 : particle.y - particle.speed * 0.1
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);


  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill in both email and password.',
        });
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      // API call 
      const response = await axios.post('http://localhost:8090/users/login', {
        email,
        password
      });

      if (response.status === 200) {
        const data = response.data;
            Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                text: 'Welcome to the MCQ System. Redirecting...',
                timer: 2000,
                showConfirmButton: false,
                });

        setTimeout(() => {
           if(data.user.role === "admin"){
              navigate('/admin_dashboard')
           }
           else{
              navigate(`/user_dashboard/${data.user.id}/${data.user.name}`);
           }

        }, 2000);

      } else {
        throw new Error('Invalid credentials');
      }

    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid email or password. Please try again.',
        });

      setIsLoading(false);
    }
  };

  const stats = [
    { icon: Users, label: 'Active Users', value: '10K+' },
    { icon: BookOpen, label: 'Questions', value: '50K+' },
    { icon: Trophy, label: 'Completed Tests', value: '100K+' }
  ];

  return (
    <div className="login-container">
      {/* Animated background */}
      <div className="particles-container">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity
            }}
          />
        ))}
      </div>

      {/* shapes */}
      <div className="geometric-shapes">
        <div className="shape-circle-1"></div>
        <div className="shape-circle-2"></div>
        <div className="shape-square"></div>
      </div>

      <div className="main-content">
        {/* Left Section nfo */}
        <div className="branding-section">
          <div className="branding-content">
            {/* Logo & Title */}
            <div className="logo-section">
              <div className="logo-container">
                <Brain className="logo-icon" />
              </div>
              <div className="logo-text">
                <h1 className="brand-title">MCQ System</h1>
                <p className="brand-subtitle">Smart Learning Platform</p>
              </div>
            </div>

            {/* Description */}
            <h2 className="main-heading">
              Master Your Knowledge with 
              <span className="gradient-text"> Interactive Quizzes</span>
            </h2>
            
            <p className="description">
              Join thousands of learners in our comprehensive MCQ platform. Test your knowledge, 
              track your progress, and achieve excellence through smart assessment tools.
            </p>

            {/* Stats */}
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item" style={{animationDelay: `${index * 0.2}s`}}>
                  <div className="stat-icon-container">
                    <stat.icon className="stat-icon" />
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="form-section">
          <div className="form-container">
            {/* Mobile Logo */}
            <div className="mobile-logo">
              <div className="mobile-logo-container">
                <Brain className="mobile-logo-icon" />
              </div>
              <h1 className="mobile-brand-title">MCQ System</h1>
            </div>

            {/* Login Card */}
            <div className="login-card">
              <div className="login-header">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Sign in to continue your learning journey</p>
              </div>

              <div className="login-form">
                {/* Email Field */}
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <div className="input-container">
                    <Mail className="input-icon" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="input-group">
                  <label className="input-label">Password</label>
                  <div className="input-container">
                    <Lock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input password-input"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="login-button"
                >
                  {isLoading ? (
                    <div className="loading-content">
                      <div className="loading-spinner"></div>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;