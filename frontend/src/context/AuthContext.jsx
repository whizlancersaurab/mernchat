


import React, { createContext, useEffect, useState } from 'react'

export const AuthProvider = createContext(null)

const AuthContext = ({children}) => {

    const [auth , setAuth] = useState(false)
    const [user,setUser] =useState('')
   
  useEffect(()=>{
    if(localStorage.getItem('token')){
        setAuth(true)
        setUser(localStorage.getItem('user'))
    }

  } , [setAuth])

  return (
    <AuthProvider.Provider value={{auth,setAuth}} >
        {children}
    </AuthProvider.Provider>
  )
}

export default AuthContext
