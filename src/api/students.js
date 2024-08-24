import axios from 'axios';
import { backendUrl } from '../config/server';

const resource = 'api/students';

export const fetchStudents = async () => {
  const token = localStorage.getItem('token');
  return await axios.get(`${backendUrl}/${resource}`, { headers: { 'Authorization': token } });
};

export const createStudent = async (student) => {
  const token = localStorage.getItem('token');
  return await axios.post(`${backendUrl}/${resource}`, student, { headers: { 'Authorization': token } });
};

export const updateStudent = async (student) => {
  const token = localStorage.getItem('token');
  return await axios.put(`${backendUrl}/${resource}`, student, { headers: { 'Authorization': token } });
};

export const deleteStudent = async (studentId) => {
  const token = localStorage.getItem('token');
  return await axios.delete(`${backendUrl}/${resource}/${studentId}`, { headers: { 'Authorization': token } });
}
