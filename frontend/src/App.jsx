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
import AuthComponent from './Components/AuthComponent'



const App = () => {
  const {theme} = useContext(AuthProvider)
  return (
    <div
  data-bs-theme={theme}
  style={{
    backgroundColor: theme === 'dark' ? '#a09c9cff' : '#e1e4e7ff',  // dark gray vs light gray
   
  }}
>
      <Router>
        <Navbar />
        <Routes>


          <Route element={<AuthComponent />}>
            <Route path='/' element={<Users />} />
          </Route>


          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

        </Routes>
      </Router>
      <ToastContainer autoClose={1000} transition={Zoom} />



    </div>
  )
}

export default App
