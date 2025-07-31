import React, { createContext, useEffect, useState } from 'react'

export const AuthProvider = createContext(null)

const AuthContext = ({children}) => {

    const [auth , setAuth] = useState(false)
    const [user,setUser] =useState('')
   
  useEffect(()=>{
    if(localStorage.getItem('user')){
        setAuth(true)
        setUser(JSON.parse(localStorage.getItem('user')))
    }

  } , [setAuth])

  return (
    <AuthProvider.Provider value={{auth,setAuth , user,setUser}} >
        {children}
    </AuthProvider.Provider>
  )
}

export default AuthContext
