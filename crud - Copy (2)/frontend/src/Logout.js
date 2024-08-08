import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';

function Logout() {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <NavLink className="navbar-brand" to="/">Stocks</NavLink>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/add">Add Items</NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/logout">Logout</NavLink>
            </li>
          </ul>
        </div>
      </nav>
      {/* Logout Content */}
      <div className="container">
        <h1 className="my-4">Logout</h1>
        {/* Add your logout handling logic here */}
      </div>
    </div>
  );
}

export default Logout;
