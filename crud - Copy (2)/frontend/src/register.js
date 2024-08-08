import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    axios.post('http://localhost:8081/api/register', { username, email, password, department, college })
      .then(() => {
        alert('Registration request sent to admin. Please wait for approval.');
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
          <div className='mb-3'>
            <label htmlFor="email" className="form-label">Email</label>
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
          <div className='mb-3'>
            <label htmlFor="password" className="form-label">Password</label>
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
          <div className='mb-3'>
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
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
          <div className='mb-3'>
            <label htmlFor="department" className="form-label">Department</label>
            <select
              id="department"
              className='form-select'
              value={department}
              onChange={e => setDepartment(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              <option value="Incubation">Incubation</option>
              <option value="CSE">CSE</option>
              <option value="Management">Management</option>
            </select>
          </div>
          <div className='mb-3'>
            <label htmlFor="college" className="form-label">College</label>
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
          <button type="submit" className='btn btn-primary w-100'>Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;