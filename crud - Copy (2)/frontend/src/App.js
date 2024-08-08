import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Product from './Product';
import Stock from './Stock';
import AddItem from './AddItem';
import AddStock from './AddStock';
import UpdateStock from './UpdateStock';
import UpdateItem from './UpdateItem';
import Logout from './Logout';
import RequestPage from './RequestPage';
import Department from './department';
import Login from './login.js';
import Register from './register.js';
import Students from './students';
import View from './view';
import './App.css'; 
import Dashboard from './Dashboard';

function App() {
  const [animation, setAnimation] = useState(false);
  const [activeContent, setActiveContent] = useState('home');
  const [result, setResult] = useState(""); 
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);
    formData.append("access_key", "e74231fe-1368-4d44-b502-76b0e8aee615");

    const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    if (data.success) { 
        console.log(data);
        setResult("Form Submitted Successfully");
        event.target.reset();
    } else {
        console.log("Error", data);
        setResult(data.message);
    }
  }

  const handleButtonClick = () => {
    setAnimation(true);
    setTimeout(() => {
      setAnimation(false);
      navigate('/view'); // Navigate to view.js after the animation
    }, 1000); // Assuming 1 second animation duration
  };

  const handleMenuClick = (content) => {
    if (content === 'home') {
      navigate('/view'); // Navigate to view.js
    } else {
      setActiveContent(content);
      setAnimation(true);
      setTimeout(() => {
        setAnimation(false);
      }, 1000);
    }
  }; 
  
  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="App">
      <Routes>
        {/* Landing Page Routes */}
        <Route
          path="/"
          element={
            <>
              <div className="bg"></div>
              <div className="bg bg2"></div>
              <div className="bg bg3"></div>
              <div className="appcontainer">
                <div className={`header ${animation ? 'header-animate' : ''}`}>
                  <img src="src/assets/logo.png" alt="Logo" />
                  <ul>
                    <li onClick={() => handleMenuClick('home')}>Home</li>
                    <li onClick={() => handleMenuClick('contact')}>Contact Us</li>
                    <li onClick={() => handleMenuClick('privacy')}>Privacy Policy</li>
                  </ul>
                  <button className="login-btn" onClick={handleLoginClick}>Login</button>
                </div>
                <div className="title">SAIRAM PRODUCT HUB</div>
                <div className={`content ${animation ? 'content-animate' : ''}`}>
                  {activeContent === 'home' && (
                    <>
                      <div className="descrip">
                        <p>Inventory management involves overseeing and controlling a college&apos;s inventory...</p>
                        <img src="src/assets/invent.png" alt="Invent" />
                        <img src="src/assets/invent.png" alt="Invent" />
                        <img src="src/assets/invent.png" alt="Invent" />
                      </div>
                      <div className="button">
                        <button className={`exp ${animation ? 'exp-animate' : ''}`} onClick={handleButtonClick}>Explore</button>
                      </div>
                      <div className="descrip">
                        <h1>Incubation</h1>
                        <p>Sairam Incubation is a dynamic startup incubator dedicated to empowering...</p>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/lgAgUQFDkGY?si=Wlf08ti8EN3HJuDl" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                        <div className="button">
                          <a href="https://sairamincubation.com/" target="_blank" rel="noopener noreferrer">
                            <button className={`exp ${animation ? 'exp-animate' : ''}`} onClick={handleButtonClick}>Know More</button>
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                  {activeContent === 'contact' && (
                    <div className="descrip1">
                      <div>
                        <h3>Send us a message <img src="src/assets/msg-icon.png" alt="Message Icon" /> </h3>
                        <p>Feel free to reach out through the contact form or find our contact information below...</p>
                        <ul>
                          <li> <img src="src/assets/mail-icon.png" alt="Mail Icon" /> thiya@gmail.com</li>
                          <li> <img src="src/assets/phone-icon.png" alt="Phone Icon" /> +91 123-456-7890</li>
                          <li><img src="src/assets/location-icon.png" alt="Location Icon" /> nagar avdi<br /> chennai</li>
                        </ul>
                      </div>
                      <div className="submit">
                        <form onSubmit={onSubmit}>
                          <label><div className="label">Your Name</div></label>
                          <input type="text" name="name" placeholder="Enter your name " required />
                          <label><div className="label">Phone Number</div></label>
                          <input type="tel" name="phone" placeholder="Enter your mobile number" required />
                          <label><div>Write your message here..!</div></label>
                          <textarea name="message" rows="6" placeholder="Enter your message..!" required></textarea>
                          <div className="button"><button type="submit" className="btn dark-btn">Submit Now</button></div>
                        </form>
                      </div>
                      {result && <div className="result">{result}</div>}
                    </div>
                  )}
                  {activeContent === 'privacy' && (
                    <div className="descrip2">
                      <p>Your privacy is important to us. Read our privacy policy to understand how we handle your data.</p>
                      <img src="src/assets/privacy.png" alt="Privacy Policy" />
                    </div>
                  )}
                </div>
              </div>
            </>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/students" element={<Students />} />
        <Route path="/view" element={<View />} />
        <Route path="/product" element={<Product />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/stocks/createStock" element={<AddStock />} />
        <Route path="/create" element={<AddItem />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/update/:id" element={<UpdateItem />} />
        <Route path="/updateStock/:id" element={<UpdateStock />} />
        <Route path="/request" element={<RequestPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/department" element={<Department />} />
      </Routes>
    </div>
  );
}

export default App;
