import axios from 'axios';

const apiBaseUrl = `http://${process.env.REACT_APP_API_DEV_HOST}:${process.env.REACT_APP_API_DEV_PORT}`;
const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': apiBaseUrl,
};

const api = axios.create({baseURL: apiBaseUrl, headers});






export default api;