// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import RequestPopup from './RequestPopup';

// const Department = () => {
//   const navigate = useNavigate();
//   const [isPopupOpen, setPopupOpen] = useState(false);
//   const [location, setLocation] = useState('');

//   const handleProductPageNavigation = (location) => {
//     navigate('/product', { state: { location } });
//   };

//   const openPopup = (location) => {
//     setLocation(location);
//     setPopupOpen(true);
//   };

//   return (
//     <div>
//       <button onClick={() => handleProductPageNavigation('Incubation')}>Go to Incubation Products</button>
//       <button onClick={() => handleProductPageNavigation('CSE')}>Go to CSE Products</button>
//       <button onClick={() => handleProductPageNavigation('ECE')}>Go to ECE Products</button>
//       <button onClick={() => handleProductPageNavigation('MECH')}>Go to MECH Products</button>

//       <button onClick={() => openPopup('Incubation')}>Open Incubation Requests</button>
//       <button onClick={() => openPopup('CSE')}>Open CSE Requests</button>
//       <button onClick={() => openPopup('ECE')}>Open ECE Requests</button>
//       <button onClick={() => openPopup('MECH')}>Open MECH Requests</button>

//       <RequestPopup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)} location={location} />
//     </div>
//   );
// };

// export default Department;
