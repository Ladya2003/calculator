import axios from 'axios';
import { backendUrl } from '../config/server';

const resource = 'api/teachers';

export const fetchTeachers = async () => {
  const token = localStorage.getItem('token');
  return await axios.get(`${backendUrl}/${resource}`, { headers: { 'Authorization': token } });
};

export const createTeacher = async (teacher) => {
  const token = localStorage.getItem('token');
  return await axios.post(`${backendUrl}/${resource}`, teacher, { headers: { 'Authorization': token } });
};

export const updateTeacher = async (teacher) => {
  const token = localStorage.getItem('token');
  return await axios.put(`${backendUrl}/${resource}`, teacher, { headers: { 'Authorization': token } });
};

export const deleteTeacher = async (teacherId) => {
  const token = localStorage.getItem('token');
  return await axios.delete(`${backendUrl}/${resource}/${teacherId}`, { headers: { 'Authorization': token } });
}
