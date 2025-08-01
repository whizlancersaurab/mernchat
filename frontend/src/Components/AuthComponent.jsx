import React from 'react'
import { useContext } from 'react'
import { AuthProvider } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const AuthComponent = () => {

    const { auth, loading } = useContext(AuthProvider)
    if (loading) {
        return <div className='text-center my-5'> <div className='spinner-border text-black' role='status'></div></div>
    }

    return auth ? <Outlet /> : <Navigate to={'/login'} />
}

export default AuthComponent
