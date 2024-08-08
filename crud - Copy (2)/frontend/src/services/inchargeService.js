import axios from 'axios';

const API_URL = 'http://localhost:5000/api/incharge';

const getInchargeDetailsByLocation = (location) => {
    return axios.get(`${API_URL}/${location}`);
};

export default {
    getInchargeDetailsByLocation,
};
