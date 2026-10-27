import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/recipes',
});

export default API;