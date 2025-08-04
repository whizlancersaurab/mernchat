import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import chatImg from '../assets/user.png';
import {registerUser} from '../services/api'

const Register = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: '',
        status: ''
    });

    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.firstname.trim()) newErrors.firstname = "Firstname is required";
        else if (formData.firstname.length < 3) newErrors.firstname = "Firstname must be at least 3 characters";

        if (!formData.lastname.trim()) newErrors.lastname = "Lastname is required";

        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Minimum 6 characters required";

        if (!formData.role) newErrors.role = "Please select a role";
        if (!formData.status) newErrors.status = "Please select status";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const form = new FormData();
            for (let key in formData) {
                form.append(key, formData[key]);
            }
            if (image) {
                form.append('image', image);
            }

            // const res = await axios.post('http://localhost:8080/api/auth/register', form, {
            //     headers: { 'Content-Type': 'multipart/form-data' }
            // });

            const res = await registerUser(form)

            if (res.data.success) {
                toast.success(res.data.message);
                setFormData({
                    firstname: '',
                    lastname: '',
                    email: '',
                    password: '',
                    role: '',
                    status: ''
                });
                setImage(null);
                navigate('/login');
            }
        } catch (error) {
            const err = error?.response?.data?.message || 'Something went wrong during registration!';
            toast.error(err);
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <form
                className="bg-white shadow p-5 rounded-4 col-12 col-sm-6"
                onSubmit={handleSubmit}
                noValidate
            >
                <h2 className="text-center mb-4 text-primary">Register Form</h2>

                <div className="mb-3">
                    <label htmlFor="firstname" className="form-label">Firstname</label>
                    <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        className={`form-control ${errors.firstname && 'is-invalid'}`}
                    />
                    {errors.firstname && <div className="invalid-feedback">{errors.firstname}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="lastname" className="form-label">Lastname</label>
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className={`form-control ${errors.lastname && 'is-invalid'}`}
                    />
                    {errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}
                </div>

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

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="role" className="form-label">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={`form-select ${errors.role && 'is-invalid'}`}
                        >
                            <option value="">Select Role</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="status" className="form-label">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={`form-select ${errors.status && 'is-invalid'}`}
                        >
                            <option value="">Select Status</option>
                            <option value="0">Active</option>
                            <option value="1">De-Active</option>
                        </select>
                        {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                    </div>
                </div>

                <div className='mb-3 text-center'>
                    <label htmlFor="img" className="rounded-circle border d-flex align-items-center justify-content-center mx-auto" style={{ height: '90px', width: '90px', overflow: 'hidden' }}>
                        <img src={image ? URL.createObjectURL(image) : chatImg} alt="Preview" style={{ height: '90px', width: '90px', objectFit: 'cover' }} />
                    </label>
                    <input
                        className='d-none'
                        id='img'
                        name='image'
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                <div className="text-center">
                    <button className="btn btn-sm btn-outline-primary px-5" type="submit">Register</button>
                    <Link className='nav-link mt-2' to={'/login'}>Already have an account?</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;
