import axios from 'axios';
import { backendUrl } from '../config/server';

const resource = 'api/users';

export const getProtectedUser = async (token) => {
    return await axios.post(`${backendUrl}/${resource}/protection`, {}, { headers: { 'Authorization': token } });
};

export const createUser = async (user) => {
    const token = localStorage.getItem('token');
    return await axios.post(`${backendUrl}/${resource}/register`, user, { headers: { 'Authorization': token } });
};

export const loginUser = async (user) => {
    const token = localStorage.getItem('token');
    return await axios.post(`${backendUrl}/${resource}/login`, user, { headers: { 'Authorization': token } });
};

export const updateUser = async (user) => {
    const token = localStorage.getItem('token');
    return await axios.put(`${backendUrl}/${resource}`, user, { headers: { 'Authorization': token } });
};

export const getUser = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(`${backendUrl}/${resource}`, { headers: { 'Authorization': token } });
}