import React, { useContext } from 'react';
import chatboat from '../assets/sau.png';
import { AuthProvider } from '../context/AuthContext';
import { Link, NavLink } from 'react-router-dom'
import axios from 'axios'

const Navbar = () => {

  const { auth, setAuth } = useContext(AuthProvider)

  const handleLogout = async()=>{
      try {

        const res = await axios.get()
        
      } catch (error) {
        
      }
  }

  return (
    <nav className="navbar navbar-expand-lg bg-primary-subtle">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img src={chatboat} width={65} style={{ mixBlendMode: 'darken' }} alt="Chat Logo" />
        </a>

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
            <li className="nav-item">
              <NavLink
                to="/register"
                className={({ isActive }) => `nav-link fw-semibold ${isActive ? "text-danger" : ""}`}
              >
                Users
              </NavLink>
            </li>

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
                      saurabh
                    </button>
                  </li>
                  <li className="nav-item">
                    <button

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
