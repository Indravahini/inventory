import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import RequestPopup from './RequestPopup'; 
import Modal from 'react-modal'; 

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [addCount, setAddCount] = useState(0); 
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isRequestPopupOpen, setRequestPopupOpen] = useState(false); 

  const navigate = useNavigate();
  const location = useLocation();
  const currentLocation = location.state?.location || '';
  const department = localStorage.getItem('department'); // Assuming department is stored in local storage

  useEffect(() => {
    axios.get('http://localhost:8081/api')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:8081/api')
        .then(res => {
            setProducts(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setError(err);
            setLoading(false);
        });
  };

  const handleDelete = async (id) => {
    try {
        console.log('Attempting to delete product with S.no:', id);
        const response = await axios.delete(`http://localhost:8081/api/product/${id}`);
        console.log('Delete response:', response.data);
        fetchProducts(); 
    } catch (err) {
        console.error('Error deleting product:', err);
    }
  };

  const handleAddItemClick = () => {
    navigate('/add-item', { state: { location: currentLocation } });
  };

  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditClick = (product) => {
    setEditingProductId(product['S.no']);
    setEditedProduct({
        ...product,
        destroyed: product.destroyed || 0, 
    });
  };

  const handleAddCountChange = (event) => {
    setAddCount(parseInt(event.target.value));
  };

  const handleSave = async () => {
    const originalProduct = products.find(p => p['S.no'] === editedProduct['S.no']);
    
    if (addCount < 0) {
        alert('Count to add must be positive.');
        return;
    }

    const newCount = originalProduct.count + addCount;

    const updatedProduct = {
        ...editedProduct,
        count: newCount,
        current_stock: newCount - (originalProduct.used + editedProduct.destroyed)
    };

    try {
        const response = await axios.put(`http://localhost:8081/api/update/${editedProduct['S.no']}`, updatedProduct);
        console.log('Save response:', response.data);
        setProducts(products.map(product =>
            product['S.no'] === editedProduct['S.no'] ? updatedProduct : product
        ));
        setEditingProductId(null);
        setAddCount(0); // Reset add count
    } catch (err) {
        console.error('Error saving changes:', err);
    }
  };

  const handleCancel = () => {
    setEditingProductId(null);
    setAddCount(0); 
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleRequestPopupOpen = () => {
    setRequestPopupOpen(true);
  };

  const handleRequestPopupClose = () => {
    setRequestPopupOpen(false);
  };

  // Modify the filtering logic
  let filteredProducts = products;

  if (department !== 'Management') {
    filteredProducts = filteredProducts.filter(product => product.Location === currentLocation);
  }

  if (categoryFilter !== '') {
    filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
  }
  if (searchTerm !== '') {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      product.id.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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
            <li className="nav-item">
              <Link className="nav-link" to="#" onClick={handleRequestPopupOpen}>Requests</Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4 mb-2">
            <select className="form-select" onChange={handleCategoryFilterChange} value={categoryFilter}>
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Sensors">Sensors</option>
              <option value="Lighting">Lighting</option>
            </select>
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Product or Product ID"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
          </div>
        </div>
      </div>

      <div className="container my-4">
          <button className='btn btn-primary btn-sm' onClick={handleAddItemClick}>Add Item</button>
        <table className="table table-striped" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>S.no</th>
              <th>Product</th>
              <th>Product ID</th>
              <th>Count</th>
              <th>Used</th>
              <th>Consumed</th>
              <th>Current Stock</th>
              <th>Category</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product['S.no']}>
                <td>{index+1}</td>
                <td>{product.name}</td>
                <td>{product.id}</td>
                <td>
                  {editingProductId === product['S.no'] ? (
                    <>
                      <input
                        type="number"
                        value={addCount}
                        onChange={handleAddCountChange}
                        style={{ width: '60px', marginRight: '5px' }}
                      />
                      <button className='btn btn-success btn-sm' onClick={handleSave}>Add</button>
                      <button className='btn btn-secondary btn-sm' onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <span>{product.count}</span>
                  )}
                </td>
                <td>{product.used}</td>
                <td>{product.destroyed}</td>
                <td>{product.current_stock}</td>
                <td>{product.category}</td>
                <td>{product.Location}</td>
                <td>
                  <button className='btn btn-primary btn-sm' onClick={() => handleEditClick(product)}>Edit</button>
                  <button className='btn btn-danger btn-sm' onClick={() => handleDelete(product['S.no'])}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Product Details"
        ariaHideApp={false}
      >
        <h2>Product Details</h2>
        {selectedProduct && (
          <div>
            <p>Name: {selectedProduct.name}</p>
            <p>Product ID: {selectedProduct.id}</p>
            <p>Count: {selectedProduct.count}</p>
            <p>Used: {selectedProduct.used}</p>
            <p>Consumed: {selectedProduct.destroyed}</p>
            <p>Current Stock: {selectedProduct.current_stock}</p>
            <p>Category: {selectedProduct.category}</p>
            <p>Location: {selectedProduct.Location}</p>
          </div>
        )}
        <button onClick={handleCloseModal}>Close</button>
      </Modal>

      {isRequestPopupOpen && <RequestPopup location={currentLocation} department={localStorage.getItem('department')} onClose={handleRequestPopupClose} />}
    </div>
  );
};

export default Product;
