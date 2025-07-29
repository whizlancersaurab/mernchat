import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './App.css'
import Navbar from './Components/Navbar'
import Users from './Components/Users'
import Register from './Components/Register'
import {BrowserRouter as Router , Route , Routes} from 'react-router-dom'
import {ToastContainer, Zoom} from 'react-toastify'
import Login from './Components/Login'



const App = () => {
  return (
    <div>
      <Router>
         <Navbar/>
        <Routes>
          <Route path='/' element={ <Users/>}   />            
          <Route path='/register' element={ <Register/>}   />   
          <Route path='/login' element={ <Login/>}   />   
                    
        </Routes>
      </Router>
      <ToastContainer autoClose={1000} transition={Zoom}   />
     
     
    
    </div>
  )
}

export default App
