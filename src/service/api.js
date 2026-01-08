import axios from 'axios';

const spaceXClient = axios.create({
  baseURL: 'https://api.spacexdata.com',
  // baseURL: 'https://api.spacexdataxzxczxczx.com',
  timeout: 120000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // You can add other default headers here if needed
  }
});

export default spaceXClient;
