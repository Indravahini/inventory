import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateStock() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState({
    product: '',
    project: '',
    student_name: '',
    student_id: '',
    quantity: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8081/api/stock/${id}`)
      .then(res => {
        setStock(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setStock({ ...stock, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8081/api/updateStock/${id}`, stock);
      console.log('Update stock response:', response.data);
      navigate('/stocks');
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  };

  const validateStudentID = (id) => {
    const regex = /^SIT\d{2}CS\d{3}$/;
    return regex.test(id);
  };

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
    <div className="container my-4">
      <h2>Update Stock</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="product" className="form-label">Product</label>
          <input type="text" className="form-control" id="product" name="product" value={stock.product} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="project" className="form-label">Project</label>
          <input type="text" className="form-control" id="project" name="project" value={stock.project} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="student_name" className="form-label">Student Name</label>
          <input type="text" className="form-control" id="student_name" name="student_name" value={stock.student_name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="student_id" className="form-label">Student ID</label>
          <input type="text" className="form-control" id="student_id" name="student_id" value={stock.student_id} onChange={handleChange} required />
          {!validateStudentID(stock.student_id) && <small className="text-danger">Invalid Student ID format</small>}
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input type="number" className="form-control" id="quantity" name="quantity" value={stock.quantity} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
}

export default UpdateStock;
