
import axios from 'axios'

const baseUrl = 'http://localhost:8080/api'


const api = axios.create({
    baseUrl,

})

export const registerUser = (formdata)=>api.get('/register',formdata)
export const loginUser = (formdata)=>api.get('/register',formdata)
// export const registerUser = (formdata)=>api.get('/register',formdata)