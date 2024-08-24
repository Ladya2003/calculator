import axios from 'axios';
import { backendUrl } from '../config/server';

const resource = 'api/calculations';

export const fetchCalculations = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(`${backendUrl}/${resource}`, { headers: { 'Authorization': token } });
};
  
export const createCalculation = async (calculation) => {
    const token = localStorage.getItem('token');
    return await axios.post(`${backendUrl}/${resource}`, calculation, { headers: { 'Authorization': token } });
};

export const updateCalculation = async (calculation) => {
    const token = localStorage.getItem('token');
    return await axios.put(`${backendUrl}/${resource}`, calculation, { headers: { 'Authorization': token } });
};

export const deleteCalculation = async (calculationId) => {
    const token = localStorage.getItem('token');
    return await axios.delete(`${backendUrl}/${resource}/${calculationId}`, { headers: { 'Authorization': token } });
}
