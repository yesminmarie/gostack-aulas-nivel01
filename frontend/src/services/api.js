import axios from 'axios';

//cria uma instância do axios para passar uma informação chamada baseURL
const api = axios.create({
    baseURL: 'http://localhost:3333'
});

export default api;