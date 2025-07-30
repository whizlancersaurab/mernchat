import React, { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({

        email: '',
        password: '',

    });

    const { setAuth ,setUser} = useContext(AuthProvider)
    const navigate = useNavigate()

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

        if (!formData.password) newErrors.password = "Password is required";

        setErrors(newErrors)
        return Object.keys(newErrors).length == 0
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return
        }

        try {

            const res = await axios.post('http://localhost:8080/api/auth/login', formData)
            // console.log(res)
            if (res.data.success) {
                localStorage.setItem('user', JSON.stringify(res.data.user))
                toast.success(res.data.message)
                setUser(res.data.user)
                setAuth(true)
                setFormData({
                    email: '',
                    password: ''
                })
                navigate('/')


            }

        } catch (error) {
            const errMessage =
                error?.response?.data?.message || 'Something went wrong during Login.';
            toast.error(errMessage);

        }


    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <form
                className="bg-white shadow p-5 rounded-4 col-12 col-sm-6  "
                onSubmit={handleSubmit}
                noValidate
            >
                <h2 className="text-center mb-4 text-success">Login Form</h2>


                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-control ${errors.email && 'is-invalid'}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`form-control ${errors.password && 'is-invalid'}`}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="text-center ">
                    <button className="btn btn-sm btn-outline-success px-5">Login</button>
                    <Link className='nav-link' to={'/register'}>Don't have an account ?</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
