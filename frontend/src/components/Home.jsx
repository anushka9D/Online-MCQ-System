import { useState, useEffect } from 'react';
import { Brain, ArrowRight, CheckCircle, Users, BookOpen, Trophy, Star, Zap, Target, Award,ArrowDown,} from 'lucide-react';
import '../css/Home.css';

function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [particles, setParticles] = useState([]);


  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.3 + 0.1
      });
    }
    setParticles(newParticles);
  }, []);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y <= -5 ? 105 : particle.y - particle.speed * 0.05
      })));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
     window.location.href = '/login';
  };

  const features = [
    {
      icon: Target,
      title: "Smart Assessment",
      description: "AI-powered questions that adapt to your learning level and provide personalized feedback."
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get immediate feedback and detailed explanations for every question you attempt."
    },
    {
      icon: Trophy,
      title: "Progress Tracking",
      description: "Monitor your improvement with comprehensive analytics and performance insights."
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Join thousands of learners and compete in challenges and leaderboards."
    }
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Active Learners" },
    { icon: BookOpen, value: "100K+", label: "Practice Questions" },
    { icon: Award, value: "95%", label: "Success Rate" },
    { icon: Star, value: "4.9/5", label: "User Rating" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Medical Student",
      content: "This platform completely transformed my study routine. The adaptive questions helped me identify weak areas and improve systematically.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Engineering Student",
      content: "The instant feedback and detailed explanations make learning so much more effective. I've seen a 40% improvement in my test scores!",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "High School Student",
      content: "The gamified approach keeps me motivated. The leaderboards and achievements make studying actually fun and competitive.",
      rating: 5
    }
  ];

return (
    <div className="landing-page">
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
            }}
          />
        ))}
        
        {/* Geometric Shapes */}
        <div className="geometric-shape-1" />
        <div className="geometric-shape-2" />
        <div className="geometric-shape-3" />
      </div>

      {/* Navigation */}
      <nav className={`navbar ${scrollY > 50 ? 'navbar-blur' : 'navbar-transparent'}`}>
        <div className="navbar-container">
          <div className="navbar-content">
            {/* Logo */}
            <div className="logo">
              <div className="logo-icon">
                <Brain className="icon text-white" />
              </div>
              <span className="logo-text">MCQ System</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="animate-fade-in-up">
            <div className="trust-badge">
              <Star className="icon text-yellow" />
              <span className="trust-badge-text">Trusted by 50,000+ learners worldwide</span>
            </div>
          </div>

          <h1 className="hero-title animate-fade-in-up animation-delay-200">
            Master Your Knowledge with
            <span className="hero-title-gradient">
              Smart MCQ Practice
            </span>
          </h1>

          <p className="hero-description animate-fade-in-up animation-delay-400">
            Transform your learning experience with AI-powered assessments, instant feedback, 
            and personalized study paths designed to boost your performance.
          </p>

          <div className="hero-buttons animate-fade-in-up animation-delay-600">
            <button 
              onClick={handleGetStarted}
              className="btn-primary"
            >
              Get Started Free
              <ArrowRight className="ml-2 icon" />
            </button>
          </div>

          {/* Stats */}
          <div className="stats-grid animate-fade-in-up animation-delay-800">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">
                  <stat.icon className="icon text-purple-light" />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="scroll-indicator">
            <ArrowDown className="icon-lg" style={{color: 'rgba(255, 255, 255)'}} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              Why Choose Our Platform?
            </h2>
            <p className="section-description">
              Experience the future of learning with cutting-edge features designed to maximize your success
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="feature-card"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="feature-icon">
                  <feature.icon className="icon text-white" />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* comment Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              What Our Students Say
            </h2>
            <p className="section-description">
              Join thousands of successful learners who transformed their academic performance
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="testimonial-card"
              >
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="star" />
                  ))}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div>
                  <div className="testimonial-author">{testimonial.name}</div>
                  <div className="testimonial-role">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-card">
            <h2 className="cta-title">
              Ready to Transform Your Learning?
            </h2>
            <p className="cta-description">
              Join our community of successful learners and start your journey to academic excellence today.
            </p>
            <div className="cta-buttons">
              <button 
                onClick={handleGetStarted}
                className="btn-cta"
              >
                Start Learning Now
                <ArrowRight className="ml-2 icon-md" />
              </button>
              <div className="cta-note">
                <CheckCircle className="icon-sm mr-1" />
                Free to start • No credit card required
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-content">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <Brain className="icon text-white" />
              </div>
              <span className="footer-logo-text">MCQ System</span>
            </div>
            <div className="footer-text">
              <p>&copy; 2024 MCQ System. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;