const axios = require('axios');

const api = axios.create({
    baseURL: "http://192.168.50.24:19000",
});

export default api;