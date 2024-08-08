import { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function RequestPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { item, currentStock, location: itemLocation } = location.state; // Extract currentStock and itemLocation
    const [requestDetails, setRequestDetails] = useState({
        product: item.name,
        project: '',
        student_name: '',
        student_id: '',
        quantity: 1,
        type: 'rent',
        location: itemLocation // Use itemLocation to prefill the location field
    });
    const [error, setError] = useState('');

    const handleRequestChange = (e) => {
        const { name, value } = e.target;
        setRequestDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleRequestSubmit = async () => {
        const studentIdPattern = /^[A-Za-z]{3}\d{2}[A-Za-z]{2}\d{3}$/;
        if (!studentIdPattern.test(requestDetails.student_id)) {
            setError('Student ID must be in the format "SIT22CS086" or "sit22cs086"');
            return;
        }

        if (requestDetails.quantity > currentStock) {
            setError(`Quantity cannot exceed current stock (${currentStock})`);
            return;
        }

        try {
            await axios.post('http://localhost:8081/api/request', requestDetails);
            navigate('/');
        } catch (error) {
            console.error('Error submitting request:', error);
        }
    };

    return (
        <div className='d-flex vh-100 justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-4'>
                <h2 className='text-center mb-4' style={{ color: 'blue' }}>Request Product</h2>
                <div className="form-group">
                    <label>Product</label>
                    <input 
                        type="text" 
                        name="product" 
                        value={requestDetails.product} 
                        onChange={handleRequestChange} 
                        className="form-control" 
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label>Project</label>
                    <input 
                        type="text" 
                        name="project" 
                        value={requestDetails.project} 
                        onChange={handleRequestChange} 
                        className="form-control" 
                    />
                </div>
                <div className="form-group">
                    <label>Student Name</label>
                    <input 
                        type="text" 
                        name="student_name" 
                        value={requestDetails.student_name} 
                        onChange={handleRequestChange} 
                        className="form-control" 
                    />
                </div>
                <div className="form-group">
                    <label>Student ID</label>
                    <input 
                        type="text" 
                        name="student_id" 
                        value={requestDetails.student_id} 
                        onChange={handleRequestChange} 
                        className="form-control" 
                    />
                </div>
                <div className="form-group">
                    <label>Quantity</label>
                    <input 
                        type="number" 
                        name="quantity" 
                        value={requestDetails.quantity} 
                        onChange={handleRequestChange} 
                        className="form-control" 
                        min="1"
                    />
                </div>
                <div className="form-group">
                    <label>Type</label>
                    <div>
                        <input 
                            type="radio" 
                            name="type" 
                            value="rent" 
                            checked={requestDetails.type === 'rent'} 
                            onChange={handleRequestChange}
                        /> Rent
                        <input 
                            type="radio" 
                            name="type" 
                            value="consume" 
                            checked={requestDetails.type === 'consume'} 
                            onChange={handleRequestChange}
                            className="ms-2"
                        /> consume
                    </div>
                </div>
                <div className="form-group">
                    <label>Location</label>
                    <input 
                        type="text" 
                        name="location" 
                        value={requestDetails.location} 
                        onChange={handleRequestChange} 
                        className="form-control" 
                        readOnly
                    />
                </div>
                {error && <p className="text-danger">{error}</p>}
                <button onClick={handleRequestSubmit} className="btn btn-primary mt-3">Submit Request</button>
            </div>
        </div>
    );
}

export default RequestPage;
