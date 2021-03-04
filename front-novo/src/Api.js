const axios = require('axios');

const api = axios.create({
    baseURL: "http://api-gorila.schellerg.com",
});

export default api;