import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Barcode from 'react-barcode';
import html2canvas from 'html2canvas';
import { FiDownload } from 'react-icons/fi'; // Import the download icon from react-icons
import './App.css'; // Import the CSS file for styling

const AddItem = () => {
    const location = useLocation();
    const { location: selectedLocation } = location.state || {};
    const [rows, setRows] = useState([
        { name: '', id: '', count: 0, used: 0, destroyed: 0, category: '', location: selectedLocation || '', barcode: '', incharge_name: '', incharge_phoneno: '', incharge_mail: '' }
    ]);
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedLocation) {
            fetchInchargeDetails(0, selectedLocation);
        }
    }, [selectedLocation]);

    useEffect(() => {
        // Update the location field in all rows when selectedLocation changes
        const updatedRows = rows.map(row => ({ ...row, location: selectedLocation || '' }));
        setRows(updatedRows);
    }, [selectedLocation]);

    const generateBarcode = (index) => {
        const { name, id, count, category, location } = rows[index];
        const barcodeText = `${name}-${id}-${count}-${category}-${location}`;
        const updatedRows = [...rows];
        updatedRows[index].barcode = barcodeText;
        setRows(updatedRows);
    };

    const handleRowChange = (index, e) => {
        const { name, value } = e.target;
        const updatedRows = [...rows];
        updatedRows[index][name] = value;
        setRows(updatedRows);

        // Fetch incharge details when location is changed
        if (name === 'location') {
            fetchInchargeDetails(index, value);
        }
    };

    const fetchInchargeDetails = (index, location) => {
        axios.get(`http://localhost:8081/api/incharge/${location}`)
            .then(response => {
                const { incharge_name, incharge_phoneno, incharge_mail } = response.data;
                const updatedRows = [...rows];
                updatedRows[index].incharge_name = incharge_name;
                updatedRows[index].incharge_phoneno = incharge_phoneno;
                updatedRows[index].incharge_mail = incharge_mail;
                setRows(updatedRows);
            })
            .catch(error => {
                console.error('Error fetching incharge details:', error);
            });
    };

    const handleAddRow = () => {
        const lastRow = rows[rows.length - 1];
        setRows([...rows, { ...lastRow, name: '', id: '', count: 0, used: 0, destroyed: 0, barcode: '' }]);
    };

    const handleDeleteRow = (index) => {
        const updatedRows = rows.filter((row, rowIndex) => rowIndex !== index);
        setRows(updatedRows);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const validRows = rows.map(row => ({
            name: row.name,
            id: row.id,
            count: parseInt(row.count),
            used: parseInt(row.used),
            destroyed: parseInt(row.destroyed),
            category: row.category,
            location: row.location,
            barcode: row.barcode,
            incharge_name: row.incharge_name,
            incharge_phoneno: row.incharge_phoneno,
            incharge_mail: row.incharge_mail
        }));

        const requests = validRows.map(row => 
            axios.post('http://localhost:8081/api/create', row)
        );

        Promise.all(requests)
            .then(responses => {
                console.log('Responses:', responses);
                navigate('/'); 
            })
            .catch(err => console.log('Error:', err));
    };

    const handleDownloadBarcode = (index) => {
        html2canvas(document.querySelector(`#barcode-${index}`)).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `barcode-${index}.png`;
            link.click();
        });
    };

    return (
        <div className="container mt-5">
            <h3 className="text-primary">Add Items</h3>
            <form onSubmit={handleSubmit}>
                <table className="table table-bordered table-striped mt-3">
                    <thead>
                        <tr>
                            <th>S.no</th>
                            <th>Name</th>
                            <th>ID</th>
                            <th>Count</th>
                            <th>Category</th>
                            <th>Location</th>
                            <th>Incharge Name</th>
                            <th>Incharge Phone No</th>
                            <th>Incharge Email</th>
                            <th>Barcode</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <input type="text" className="form-control" name="name" value={row.name} onChange={(e) => handleRowChange(index, e)} required />
                                </td>
                                <td>
                                    <input type="text" className="form-control" name="id" value={row.id} onChange={(e) => handleRowChange(index, e)} required />
                                </td>
                                <td>
                                    <input type="number" className="form-control" name="count" value={row.count} onChange={(e) => handleRowChange(index, e)} required />
                                </td>
                                <td>
                                    <select className="form-control" name="category" value={row.category} onChange={(e) => handleRowChange(index, e)} required>
                                        <option value="">Select Category</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Sensors">Sensors</option>
                                        <option value="Lighting">Lighting</option>
                                        <option value="Single Board Computer">Single Board Computer</option>
                                    </select>
                                </td>
                                <td>
                                    <input type="text" className="form-control" name="location" value={row.location} readOnly />
                                </td>
                                <td>
                                    <input type="text" className="form-control" name="incharge_name" value={row.incharge_name} readOnly />
                                </td>
                                <td>
                                    <input type="text" className="form-control" name="incharge_phoneno" value={row.incharge_phoneno} readOnly />
                                </td>
                                <td>
                                    <input type="email" className="form-control" name="incharge_mail" value={row.incharge_mail} readOnly />
                                </td>
                                <td>
                                    <div className="mb-3">
                                        <button type="button" className="btn btn-primary me-2" onClick={() => generateBarcode(index)}>Generate Barcode</button>
                                        {row.barcode && (
                                            <div id={`barcode-${index}`}>
                                                <Barcode value={row.barcode} />
                                                <button type="button" className="btn btn-info mt-2" onClick={() => handleDownloadBarcode(index)}>
                                                    <FiDownload />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    {rows.length > 1 && (
                                        <button type="button" className="btn btn-danger" onClick={() => handleDeleteRow(index)}>-</button>
                                    )}
                                    {index === rows.length - 1 && (
                                        <button type="button" className="btn btn-success ms-2" onClick={handleAddRow}>+</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="submit" className="btn btn-primary mt-3">Submit</button>
            </form>
        </div>
    );
};

export default AddItem;
