import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8081/api/login', { email, password })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('department', res.data.department); // Store department
        alert('Login successful. Redirecting to dashboard...');
        navigate(`/dashboard`, { state: { location: res.data.department } }); // Redirect to Dashboard.js
      })
      .catch(err => {
        console.error('Login error:', err);
        alert('Login failed. Please check your credentials and try again.');
      });
  };  

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center bg-primary'>
      <div className='p-4 bg-white rounded shadow-sm w-25'>
        <form onSubmit={handleSubmit}>
          <h1 className="text-center mb-4">Login</h1>
          <div className='mb-3'>
            <label htmlFor="email" className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><FaUser /></span>
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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" className='btn btn-success w-100'>Login</button>
          <p className="text-center mt-3">
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Login;
