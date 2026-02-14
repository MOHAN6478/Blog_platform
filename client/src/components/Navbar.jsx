import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const Navbar = () => {

    const navigate = useNavigate()
    const {token} = useAppContext()

  return (
    <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32 cursor-pointer'>
        <Link to={'/'} className='font-bold text-5xl text-gray-900/50'>Blog</Link>
        <button 
            onClick={()=> navigate('/admin')} 
            className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-purple-500 text-white px-10 py-2.5'
        >
            {token ? "Dashboard" : "Login"}
            <img src={assets.arrow} alt="arrow" className='w-3'/>
        </button>

    </div>
  )
}

export default Navbar