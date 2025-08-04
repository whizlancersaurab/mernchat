
import axios from 'axios';

const baseURL = 'http://localhost:8080/api';
export const fullUrl = 'http://localhost:8080/api/chat/uploads'


const getToken = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).token : null;
};

// 🔓 Public API (No token)
const apiPublic = axios.create({
    baseURL,
    headers: { 'Content-Type': 'multipart/form-data' }
});



const apiPublic2 = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' }
});



// 🔐 Authenticated JSON API
const apiJSON = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' }
});
apiJSON.interceptors.request.use(config => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});



// 🔐 Authenticated Multipart API
const apiForm = axios.create({
    baseURL,
    headers: { 'Content-Type': 'multipart/form-data' }
});
apiForm.interceptors.request.use(config => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});





// user routes
export const registerUser = (data) => apiPublic.post('/auth/register', data)
export const loginUser = (data) => apiPublic2.post('/auth/login', data)
export const getAllUsers = () => apiPublic2.get('/auth/allusers')
export const getUser = (id) => apiPublic2.get(`/auth/user/${id}`)
export const logoutUser = () => apiJSON.get('/auth/logout')




// send message and get message

export const getmessage = (id) => apiJSON.get(`/chat/getmessage/${id}`)
export const sendMessage = (data) => apiForm.post(`/chat/sendmessage`, data)
export const deleteMessage = (id) => apiJSON.delete(`/chat/deletemessage/${id}`)

