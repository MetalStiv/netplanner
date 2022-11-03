import axios from 'axios';

export const userMicroservice = axios.create({
    baseURL: 'http://localhost:5108/',
    timeout: 2000
});