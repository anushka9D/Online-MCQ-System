import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import UserDashboard from './components/UserDashboard'
import AdminDashboard from './components/AdminDashboard'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user_dashboard/:id/:name" element={<UserDashboard />} />
        <Route path="/admin_dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App;
