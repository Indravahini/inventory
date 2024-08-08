import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; 
import { Link, useNavigate } from 'react-router-dom'; 
import './App.css'; 
import incubationLogo from './assets/incubation.png'; 
import userIcon from './assets/user.png'; 
import axios from 'axios';
import RequestPopup from './RequestPopup'; 

const Dashboard = () => {
  const [department, setDepartment] = useState('');
  const [totalStock, setTotalStock] = useState(0);
  const [itemsRented, setItemsRented] = useState(0);
  const [itemsConsumed, setItemsConsumed] = useState(0);
  const [itemsReturned, setItemsReturned] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0); 
  const [isRequestPopupOpen, setRequestPopupOpen] = useState(false); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const userDepartment = localStorage.getItem('department');
    setDepartment(userDepartment || 'Department');

    console.log('Fetching inventory stats for department:', userDepartment);

    axios.get('http://localhost:8081/api/inventory-stats', {
      params: { department: userDepartment }
    })
    .then(res => {
      console.log('Inventory stats response:', res.data);
      setTotalStock(res.data.totalStock || 0);
      setItemsRented(res.data.itemsRented || 0);
      setItemsConsumed(res.data.itemsConsumed || 0);
      setItemsReturned(res.data.itemsReturned || 0);
    })
    .catch(err => {
      console.error('Error fetching inventory stats:', err);
    });

    // Fetch the number of pending requests
    axios.get('http://localhost:8081/api/pending-requests-count', {
      params: { department: userDepartment }
    })
    .then(res => {
      setPendingRequestsCount(res.data.count || 0);
    })
    .catch(err => {
      console.error('Error fetching pending requests count:', err);
    });

  }, [department]);

  const data = {
    labels: ['Total Stock', 'Items Rented', 'Items Consumed', 'Items Returned'],
    datasets: [
      {
        label: 'Inventory Data',
        data: [totalStock, itemsRented, itemsConsumed, itemsReturned],
        backgroundColor: ['#FF4D4D', '#4DFF4D', '#4D4DFF', '#FFFF4D'],
        hoverOffset: 4,
      },
    ],
  };

  const handleProductPage = () => {
    navigate('/product', { state: { location: department } }); 
  };

  const handleRequestPopupOpen = () => {
    setRequestPopupOpen(true); 
  };

  const handleRequestPopupClose = () => {
    setRequestPopupOpen(false); 
  };

  const handleToBeCollectedStockPage = () => {
    if (department === 'Management') {
      navigate('/stock', { state: { statusFilter: 'To be Collected', location: 'All' } });
    } else {
      navigate('/stock', { state: { statusFilter: 'To be Collected', location: department } });
    }
  };

  const handleAddItemClick = () => {
    navigate('/add-item', { state: { location: department } });
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo-container">
          <img src={incubationLogo} alt="Incubation Logo" className="incubation-logo" />
          <div className="logo">stic</div>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search products" />
        </div>
        <div className="user-profile">
          <img src={userIcon} alt="User" className="user-image" />
        </div>
        <div className="header-links">
          <button onClick={handleProductPage}>Product Page</button>
          <button onClick={handleToBeCollectedStockPage}>To be Collected Stock</button>
          <button onClick={handleAddItemClick}>Add Items</button> 
        </div>
      </header>

      <main className="main-content">
        <div className="cse-department">{department}</div>
        <div className="dashboard">
          <div className="dashboard-card">
            <h2>Total Stock</h2>
            <div className="card-content">
              <div className="value">{totalStock}</div>
            </div>
          </div>
          <div className="dashboard-card">
            <h2>Items Rented</h2>
            <div className="card-content">
              <div className="value">{itemsRented}</div>
            </div>
          </div>
          <div className="dashboard-card">
            <h2>Items Consumed</h2>
            <div className="card-content">
              <div className="value">{itemsConsumed}</div>
            </div>
          </div>
          <div className="dashboard-card">
            <h2>Items Returned</h2>
            <div className="card-content">
              <div className="value">{itemsReturned}</div>
            </div>
          </div>
        </div>

        <div className="cumulative-chart-and-buttons">
          <div className="cumulative-chart">
            <Pie data={data} />
          </div>
          <div className="buttons">
            <button onClick={handleRequestPopupOpen}>
              Request Pending <span className="notification-badge">{pendingRequestsCount}</span>
            </button>
            <Link to="/stock" state={{ statusFilter: 'Collected' }}>
              <button>Purchase History</button>
            </Link>
            <Link to="/stock">
              <button>Stock List</button>
            </Link>
            <button onClick={handleToBeCollectedStockPage}>To be Collected Stock</button>
          </div>
        </div>
      </main>

      {isRequestPopupOpen && (
        <RequestPopup
          department={department}
          onClose={handleRequestPopupClose}
        />
      )}
    </div>
  );
};

export default Dashboard;
