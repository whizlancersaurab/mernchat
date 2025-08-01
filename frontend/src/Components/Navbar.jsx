import React, { useContext } from 'react';
import chatboat from '../assets/sau.png';
import { AuthProvider } from '../context/AuthContext';
import { Link, NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {

  const { auth, setAuth ,user,setUser ,toggleTheme ,theme} = useContext(AuthProvider)
  console.log(theme)

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
    <nav style={{backgroundColor: '#f8f9fa'}} className="navbar navbar-expand-lg bg-light  border-bottom border-secondary">
      <div className="container-fluid">
        {
          user&&(<div className="navbar-brand">
          <img src={`http://localhost:8080/api/chat/uploads/${user.image}`} width={50} height={50} style={{ mixBlendMode: 'darken' , borderRadius:'100%' }} alt="Chat Logo" />
        </div>)
        }

        <button
          className="navbar-toggler text-dark"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className=""><GiHamburgerMenu className='text-dark' size={25}/></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">

          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {
              auth&&( <li className="nav-item">
                    <button

                      className="btn btn-sm btn-outline-success text-capitalize"
                    >
                      {`${user.firstname} ${user.lastname}`}
                    </button>
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
                       onClick={handleLogout}
                      className="btn btn-sm btn-outline-danger my-1 my-lg-0 mx-lg-1"
                    >
                      Logout
                    </button>
                  </li>
                </>
                

              )}
              <li className={theme=='dar'?'text-white':'text-dark'} onClick={()=>toggleTheme()}>{theme=='dark'?<MdLightMode size={25} />:<MdDarkMode size={25} />}</li>
            </ul>
          }


        </div>
      </div>
    </nav>
  );
};

export default Navbar;
