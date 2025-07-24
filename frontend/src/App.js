import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import UserDashboard from './components/UserDashboard'
import AdminDashboard from './components/AdminDashboard'
import Exam from './components/Exam'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user_dashboard/:userid/:name" element={<UserDashboard />} />
        <Route path="/admin_dashboard" element={<AdminDashboard />} />
        <Route path="/exam/:paperid/:userid" element={<Exam />} />
      </Routes>
    </Router>
  )
}

export default App;
