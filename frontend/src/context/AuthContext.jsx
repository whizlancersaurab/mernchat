import React, { createContext, useEffect, useState } from 'react'

export const AuthProvider = createContext(null)

const AuthContext = ({children}) => {

    const [auth , setAuth] = useState(false)
    const [user,setUser] =useState('')
    const [loading , setLoading] = useState(true)
    const [theme , setTheme] = useState('light')

    const toggleTheme = ()=>{
      if(theme=='light'){
        setTheme('dark')
      }else setTheme('light')
    }

   
  useEffect(()=>{
    // setLoading(true)
    if(localStorage.getItem('user')){
        setAuth(true)
        setUser(JSON.parse(localStorage.getItem('user')))
    }
    setLoading(false)

  } , [setAuth])

  return (
    <AuthProvider.Provider value={{auth,setAuth , user,setUser , theme , toggleTheme , loading}} >
        {children}
    </AuthProvider.Provider>
  )
}

export default AuthContext
