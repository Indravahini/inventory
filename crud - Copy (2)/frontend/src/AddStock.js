import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Import the CSS file for styling

const AddStock = () => {
    const [rows, setRows] = useState([
        { product: '', project: '', studentName: '', studentID: '', quantity: '' }
    ]);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8081/api')
            .then(res => {
                setProducts(res.data);
            })
            .catch(err => console.log('Error fetching products:', err));
    }, []);

    const handleRowChange = (index, e) => {
        const { name, value } = e.target;
        const updatedRows = [...rows];
        updatedRows[index][name] = value;

        if (name === 'product') {
            const selectedProduct = products.find(prod => prod.name === value);
            if (selectedProduct) {
                // You may want to perform any other operations here if needed
            }
        }

        setRows(updatedRows);
    };

    const handleAddRow = () => {
        const lastRow = rows[rows.length - 1];
        setRows([...rows, { ...lastRow, product: '', project: '', studentName: '', studentID: '', quantity: '' }]);
    };

    const handleDeleteRow = (index) => {
        const updatedRows = rows.filter((row, rowIndex) => rowIndex !== index);
        setRows(updatedRows);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const studentIDPattern = /^[A-Z]{3}\d{2}[A-Z]{2}\d{3}$/;

        for (const row of rows) {
            if (!studentIDPattern.test(row.studentID)) {
                alert('Student ID must be in the format SIT22CS086.');
                return;
            }

            // Ensure quantity does not exceed available stock
            const selectedProduct = products.find(prod => prod.name === row.product);
            if (selectedProduct && parseInt(row.quantity) > selectedProduct.current_stock) {
                alert(`Quantity for ${row.product} cannot be more than current stock (${selectedProduct.current_stock}).`);
                return;
            }
        }

        const requests = rows.map(row => 
            axios.post('http://localhost:8081/api/createStock', {
                Product: row.product,
                Project: row.project,
                StudentName: row.studentName,
                StudentID: row.studentID,
                Quantity: row.quantity,
            })
        );

        Promise.all(requests)
            .then(responses => {
                console.log('Responses:', responses);
                navigate('/stocks');
            })
            .catch(err => console.log('Error:', err));
    };

    return (
        <div className="container mt-5">
            <h3 className="text-primary">Add Stock</h3>
            <form onSubmit={handleSubmit}>
                <table className="table table-bordered table-striped mt-3">
                    <thead>
                        <tr>
                            <th>S.no</th>
                            <th>Product</th>
                            <th>Project</th>
                            <th>Student Name</th>
                            <th>Student ID</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <select
                                        className="form-control"
                                        name="product"
                                        value={row.product}
                                        onChange={(e) => handleRowChange(index, e)}
                                        required
                                    >
                                        <option value="">Select Product</option>
                                        {products.map(prod => (
                                            <option key={prod['S.no']} value={prod.name}>{prod.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input type="text" className="form-control" name="project" value={row.project} onChange={(e) => handleRowChange(index, e)} required />
                                </td>
                                <td>
                                    <input type="text" className="form-control" name="studentName" value={row.studentName} onChange={(e) => handleRowChange(index, e)} required />
                                </td>
                                <td>
                                    <input type="text" className="form-control" name="studentID" value={row.studentID} onChange={(e) => handleRowChange(index, e)} required />
                                </td>
                                <td>
                                    <input type="number" className="form-control" name="quantity" value={row.quantity} onChange={(e) => handleRowChange(index, e)} required />
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
                <button type="submit" className='btn btn-success mt-3'>SUBMIT</button>
            </form>
        </div>
    );
};

export default AddStock;
