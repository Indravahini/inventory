import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation

function Stock() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [department, setDepartment] = useState('');
  const location = useLocation(); // Get the state passed from the Dashboard.js

  useEffect(() => {
    const dept = localStorage.getItem('department');
    setDepartment(dept);
    fetchLocations();
    fetchStocks(dept, selectedLocation, location.state?.statusFilter); // Pass statusFilter from location.state
  }, [selectedLocation, location.state?.statusFilter]); // Include statusFilter in dependencies  

  const fetchLocations = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/locations');
      setLocations(res.data);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError(err);
    }
  };

  const fetchStocks = async (dept, location, statusFilter) => {
    try {
      const params = { location, status: statusFilter || 'collected' }; // Use statusFilter if available
      if (dept !== 'Management') {
        params.department = dept; 
      }
  
      const res = await axios.get('http://localhost:8081/api/stock', { params });
      setStock(res.data);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };  

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (id, status, type, quantity) => {
    const newStatus = status === 'Collected' ? 'To be Collected' : 'Collected';

    axios.put(`http://localhost:8081/api/updateStatus/${id}`, { status: newStatus, type, quantity })
      .then(res => {
        console.log('Status updated successfully:', res.data);
        fetchStocks(department, selectedLocation, location.state?.statusFilter); // Refresh the stock list
      })
      .catch(err => {
        console.error('Error updating status:', err.response ? err.response.data : err.message);
        alert(`Error updating status: ${err.response ? err.response.data.error : err.message}`);
      });
  };

  const handleTypeChange = async (id) => {
    try {
      await axios.put(`http://localhost:8081/api/updateType/${id}`, { type: 'Returned' });
      fetchStocks(department, selectedLocation, location.state?.statusFilter); // Refresh the stock list
    } catch (err) {
      console.error('Error updating type:', err);
      alert(`Error updating type: ${err.response ? err.response.data.error : err.message}`);
    }
  };

  const filteredStock = stock.filter(item => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      item.product.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.project.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.student_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.student_id.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.type.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  if (loading) {
    return <div className="container"><h1 className="my-4">Loading...</h1></div>;
  }

  if (error) {
    return (
      <div className="container">
        <h1 className="my-4">Error: Failed to fetch stock data.</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Home</Link>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/stocks">Stocks</Link>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/logout">Logout</Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mt-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Product, Project, Student Name, Student ID, or Type"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />

        {department !== 'Management' && (
          <div className="form-group mt-3">
            <label htmlFor="location-select">Filter by Location:</label>
            <select
              id="location-select"
              className="form-control"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="container my-4">
        <Link to="/stocks/createStock" className="btn btn-success mb-3">Add Purchase</Link>
        <table className="table table-striped" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>S.no</th>
              <th>Date</th>
              <th>Product</th>
              <th>Project</th>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Quantity</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStock.map((item, index) => (
              <tr key={item['S.no']}>
                <td>{index + 1}</td>
                <td>{item.Date}</td>
                <td>{item.product}</td>
                <td>{item.project}</td>
                <td>{item.student_name}</td>
                <td>{item.student_id}</td>
                <td>{item.Quantity}</td>
                <td>{item.type}</td>
                <td>{item.status}</td>
                <td>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={item.status === 'Collected'}
                      disabled={item.type === 'Returned'}
                      onChange={() => handleStatusChange(item['S.no'], item.status, item.type, item.Quantity)}
                    />
                    <label className="form-check-label">
                      Collected
                    </label>
                  </div>
                  {item.type === 'rent' && item.status === 'Collected' && (
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={item.type === 'Returned'}
                        onChange={() => handleTypeChange(item['S.no'])}
                      />
                      <label className="form-check-label">
                        Returned
                      </label>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Stock;
