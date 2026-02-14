import { useEffect } from "react";
import { createContext, useContext, useState } from "react"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

axios.defaults.withCredentials = true;

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const navigate = useNavigate()

    const[input, setInput] = useState("")
    const[blogs, setBlogs] = useState([])
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    // Get All Blogs
    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get('/api/blog/all');
            if(data.success){
                setBlogs(data.blogs)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        fetchBlogs()
    }, [token]);


    const value = {
        navigate, input, setInput, blogs, setBlogs, axios, token, setToken
    }

    return(
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
} 