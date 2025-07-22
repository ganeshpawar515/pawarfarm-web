import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const API_URL=import.meta.env.VITE_API_URL;
    const [isLoggedIn, setIsLoggedIn]=useState(false);
    const [user,setUser]=useState(null)

    const fetchUserProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/api/user/profile/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
          setIsLoggedIn(true)
        } catch (error) {
          console.log("Failed to fetch profile");
          logout()
        }
      }
    };

    const login = (token)=> {
        localStorage.setItem("access_token",token)
        fetchUserProfile()
    }
        
    const logout = ()=> {
        setIsLoggedIn(false)
        setUser(null)
        localStorage.removeItem("access_token")
    }
    useEffect(()=>{
      const token=localStorage.getItem("access_token")
      if(token){
        fetchUserProfile()
      }else{
        setIsLoggedIn(false)
        setUser(null)
      }
    },[])
    return(
        <AuthContext.Provider value={{isLoggedIn, login, logout, user,fetchUserProfile}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>useContext(AuthContext)