import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {

    const navigate = useNavigate()

    const {setToken, axios} = useAppContext()

    const logout = () => {
        localStorage.removeItem("token")  
        setToken("")                      
        delete axios.defaults.headers.common["Authorization"]
        navigate('/')
    }

  return (
    <>
        <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200'>
            <Link to={'/'} className='font-bold text-3xl cursor-pointer text-gray-900/70'>Blog</Link>
            <button onClick={logout} className='text-sm px-8 py-2 bg-purple-500 text-white rounded-full cursor-pointer'>
                Logout
            </button>
        </div>
        <div className='flex h-[calc(100vh-70px)]'>
            <Sidebar />
            <Outlet/>
        </div>
    </>
  )
}

export default Layout 