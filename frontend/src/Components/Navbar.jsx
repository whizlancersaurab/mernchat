import React, { useContext } from 'react';
import chatboat from '../assets/sau.png';
import { AuthProvider } from '../context/AuthContext';
import { Link, NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';

const Navbar = () => {

  const { auth, setAuth ,user,setUser} = useContext(AuthProvider)

// console.log(auth,user)
  const navigate = useNavigate()

  const handleLogout = async()=>{
      try {

        const res = await axios.get('http://localhost:8080/api/auth/logout' ,{
          headers:{
            Authorization:`Bearer ${user.token}`
          }
        })

        if(res.data.success){
          setAuth(false)
          localStorage.clear()
          setUser('')
          navigate('/login')
          toast.warning(res.data.message)
        }

        
      } catch (error) {
        toast.error(error?.response?.data?.message)
        
      }
  }

  return (
    <nav className="navbar navbar-expand-lg bg-secondary-subtle">
      <div className="container-fluid">
        <div className="navbar-brand">
          <img src={chatboat} width={65} style={{ mixBlendMode: 'darken' }} alt="Chat Logo" />
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {
              auth&&(<li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) => `nav-link fw-semibold ${isActive ? "text-danger" : ""}`}
              >
                ChatBoat
              </NavLink>
            </li>)
            }

          </ul>

          {
            <ul className="navbar-nav gap-2 mb-2 mb-lg-0">
              {!auth ? (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="btn btn-sm btn-outline-success ">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="btn btn-sm btn-outline-primary my-1 my-lg-0 ">
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <button

                      className="btn btn-sm text-bg-success text-capitalize"
                    >
                      {user.firstname}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                       onClick={handleLogout}
                      className="btn btn-sm btn-outline-danger my-1 my-lg-0 mx-lg-1"
                    >
                      Logout
                    </button>
                  </li>
                </>

              )}
            </ul>
          }


        </div>
      </div>
    </nav>
  );
};

export default Navbar;
