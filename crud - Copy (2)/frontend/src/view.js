import { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
import './App.css';

function View() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [hoveredItem, setHoveredItem] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const [locationFilter, setLocationFilter] = useState(""); // State for location filter
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8081');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleMouseEnter = (item, position) => {
        setHoveredItem(item);
        setPopupPosition(position);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    const handleRequestClick = (item) => {
        navigate('/request', { state: { item, currentStock: item.current_stock, location: item.Location } });
    };

    // Get unique locations for the dropdown
    const uniqueLocations = [...new Set(data.map(item => item.Location))];

    return (
        <div className='d-flex vh-100 justify-content-center align-items-center'>
            <div className='w-75 bg-white rounded p-4'>
                <h2 className='text-center mb-4' style={{ color: 'blue' }}>Stock List</h2>
                
                <div className="d-flex justify-content-between mb-3">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="form-control me-2"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="form-select"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    >
                        <option value="">All Locations</option>
                        {uniqueLocations.map((location, index) => (
                            <option key={index} value={location}>{location}</option>
                        ))}
                    </select>
                </div>

                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th className="text-center" style={{ verticalAlign: 'middle' }}>S.No</th>
                            <th className="text-center" style={{ verticalAlign: 'middle' }}>Product</th>
                            <th className="text-center" style={{ verticalAlign: 'middle' }}>Category</th>
                            <th className="text-center" style={{ verticalAlign: 'middle' }}>Location</th>
                            <th className="text-center" style={{ verticalAlign: 'middle' }}>Current Stock</th>
                            <th className="text-center" style={{ verticalAlign: 'middle' }}>Details</th>
                            <th className="text-center" style={{ verticalAlign: 'middle' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.filter((item) => {
                            return (
                                (locationFilter === "" || item.Location === locationFilter) && 
                                (search === "" || item.name.toLowerCase().includes(search.toLowerCase()))
                            );
                        }).map((item, index) => (
                            <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{item.name}</td>
                                <td className="text-center">{item.category}</td>
                                <td className="text-center">{item.Location}</td>
                                <td className="text-center">{item.current_stock}</td>
                                <td className="text-center">
                                    <button 
                                        className='btn info-btn'
                                        onMouseEnter={(e) => handleMouseEnter(item, { top: e.clientY, left: e.clientX })}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        Info
                                    </button>
                                </td>
                                <td className="text-center action">
                                    <button 
                                        className='btn request-btn me-2'
                                        onClick={() => handleRequestClick(item)}
                                    >
                                        Request
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {hoveredItem && (
                    <div className="popup" style={{ top: popupPosition.top + 'px', left: popupPosition.left + 'px' }}>
                        <div className="popup-content">
                            <span className="close" onClick={handleMouseLeave}>&times;</span>
                            <h2 className="text-center">{hoveredItem.name}</h2>
                            <p className="text-center">Incharge Name: {hoveredItem.incharge_name}</p>
                            <p className="text-center">Incharge Phone No: {hoveredItem.incharge_phoneno}</p>
                            <p className="text-center">Incharge Email: {hoveredItem.incharge_mail}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default View;
