import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaUniversity } from 'react-icons/fa';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [college, setCollege] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email) {
      alert("Email is required");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    axios.post('http://localhost:8081/api/register', { name: username, email, password, department, college })
      .then(() => {
        alert('Registration request sent to admin for approval.');
        navigate('/login'); 
      })
      .catch(err => {
        console.error('Registration error:', err.response ? err.response.data : err);
        alert('Registration failed. Please try again.');
      });
  };

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center bg-primary'>
      <div className='p-4 bg-white rounded shadow-sm w-25'>
        <form onSubmit={handleSubmit}>
          <h1 className="text-center mb-4">Register</h1>
          <div className='mb-3'>
            <label htmlFor="username" className="form-label">Username</label>
            <div className="input-group">
              <span className="input-group-text"><FaUser /></span>
              <input
                type="text"
                id="username"
                placeholder='Enter Username'
                className='form-control'
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className='mb-3'>
            <label htmlFor="email" className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><FaEnvelope /></span>
              <input
                type="email"
                id="email"
                placeholder='Enter Email'
                className='form-control'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className='mb-3'>
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input
                type="password"
                id="password"
                placeholder='Enter Password'
                className='form-control'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className='mb-3'>
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input
                type="password"
                id="confirmPassword"
                placeholder='Confirm Password'
                className='form-control'
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className='mb-3'>
            <label htmlFor="department" className="form-label">Department</label>
            <div className="input-group">
              <span className="input-group-text"><FaBuilding /></span>
              <input
                type="text"
                id="department"
                placeholder='Enter Department'
                className='form-control'
                value={department}
                onChange={e => setDepartment(e.target.value)}
                required
              />
            </div>
          </div>
          <div className='mb-3'>
            <label htmlFor="college" className="form-label">College</label>
            <div className="input-group">
              <span className="input-group-text"><FaUniversity /></span>
              <input
                type="text"
                id="college"
                placeholder='Enter College'
                className='form-control'
                value={college}
                onChange={e => setCollege(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className='btn btn-primary w-100'>Register</button>
          <p className="mt-3">Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Register;
