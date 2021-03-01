const axios = require('axios');

const api = axios.create({
    baseURL: "http://localhost:7777",
});

export default api;