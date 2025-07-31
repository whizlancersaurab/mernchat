import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './App.css'
import Navbar from './Components/Navbar'
import Users from './Components/Users'
import Register from './Components/Register'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer, Zoom } from 'react-toastify'
import Login from './Components/Login'
import { AuthProvider } from './context/AuthContext'



const App = () => {

  const { auth } = useContext(AuthProvider)


  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          {
            auth && (
              <Route path='/' element={<Users />} />
            )
          }

          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />

        </Routes>
      </Router>
      <ToastContainer autoClose={1000} transition={Zoom} />



    </div>
  )
}

export default App
