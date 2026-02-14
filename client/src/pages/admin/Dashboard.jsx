import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import TotalBlog from '../../components/admin/TotalBlog'
import Loader from '../../components/Loader'

const Dashboard = () => {

    const {axios, token} = useAppContext()

    const [ dashboardData, setDashboardData ] = useState({
        blogs: 0,
        drafts: 0,
        recentBlogs: []
    })
    const [ error, setError ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            setError(null)
            const {data} = await axios.get('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}`} })
            if(data.success){
                setDashboardData(data.dashboardData)
                setError(null)
            } else {
                setError(data.message)
                toast.error(data.message)
            }
        } catch (err) {
            toast.error(err.message)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(token){
            fetchDashboardData()
        }
    },[token])


  return !loading ? (
    <div className='flex-1 p-4 md:p-10 bg-blue-50/50'>

        {error && (
            <p className='text-red-500 mb-4'>{error}</p>
        )}

        <div className='flex flex-row flex-wrap gap-6'>

            <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
                <img src={assets.dashboard_icon_1} alt="icon"/>
                <div>
                    <p className='text-xl font-semibold text-gray-600'>{dashboardData.blogs}</p>
                    <p className='text-gray-400 font-light'>Blogs</p>
                </div>
            </div>

            <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
                <img src={assets.dashboard_icon_2} alt="icon" />
                <div>
                    <p className='text-xl font-semibold text-gray-600'>{dashboardData.drafts}</p>
                    <p className='text-gray-400 font-light'>Drafts</p>
                </div>
            </div>

        </div>

        <div>
            <div className='flex items-center gap-3 m-4 mt-6 text-gray-600'>
                <img src={assets.dashboard_icon_3} alt="icon" />
                <p>Latest Blogs</p>
            </div>

            <div className='relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
                <table className='w-full text-sm text-gray-500'>
                    <thead className='text-xs text-gray-600 text-left uppercase'>
                        <tr>
                            <th scope='col' className='px-2 py-4 xl:px-6'>#</th>
                            <th scope='col' className='px-2 py-4'>Blog Title</th>
                            <th scope='col' className='px-2 py-4 max-sm:hidden'>Date</th>
                            <th scope='col' className='px-2 py-4 max-sm:hidden'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dashboardData.recentBlogs?.map((blog, index) => {
                            return <TotalBlog key={blog.id} blog={blog} fetchBlogs={fetchDashboardData} index={index + 1}/>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
        
    </div>
  ) : (
    <div className='flex items-center mx-auto'>
        <Loader />
    </div>
  )
}

export default Dashboard