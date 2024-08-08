import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    id: '',
    count: '',
    used: '',
    destroyed: '',
    current_stock: '',
    category: '',
    location: '',
    barcode: ''
  });
  const [initialCount, setInitialCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8081/api/product/${id}`)
      .then(res => {
        setProduct(res.data);
        setInitialCount(res.data.count);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'count') {
        if (parseInt(value) >= initialCount) {
            setProduct({ ...product, [name]: value });
        }
    } else if (name === 'destroyed') {
        const newDestroyed = parseInt(value);
        // Prevent setting destroyed to a value that would result in negative current stock
        if (product.count - (product.used + newDestroyed) >= 0) {
            setProduct({ ...product, [name]: newDestroyed });
        }
    } else {
        setProduct({ ...product, [name]: value });
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8081/api/update/${id}`, product);
      console.log('Update Product response:', response.data);
      navigate('/');
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  if (loading) {
    return <div className="container"><h1 className="my-4">Loading...</h1></div>;
  }

  if (error) {
    return (
      <div className="container">
        <h1 className="my-4">Error: Failed to fetch product data.</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Product Name</label>
          <input type="text" className="form-control" id="name" name="name" value={product.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="count" className="form-label">Count</label>
          <input type="number" className="form-control" id="count" name="count" value={product.count} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="used" className="form-label">Used</label>
          <input type="number" className="form-control" id="used" name="used" value={product.used} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="destroyed" className="form-label">Destroyed</label>
          <input type="number" className="form-control" id="destroyed" name="destroyed" value={product.destroyed} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select className="form-control" id="category" name="category" value={product.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Sensors">Sensors</option>
            <option value="Lighting">Lighting</option>
            <option value="Single Board Computer">Single Board Computer</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location</label>
          <input type="text" className="form-control" id="location" name="location" value={product.location} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="barcode" className="form-label">Barcode</label>
          <input type="text" className="form-control" id="barcode" name="barcode" value={product.barcode} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Update Product</button>
      </form>
    </div>
  );
}

export default UpdateItem;
