import React, { useEffect, useState } from 'react'
import BlogTableItem from '../../components/admin/BlogTableItem'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import Loader from '../../components/Loader'

const ListBlog = () => {

    const [blogs, setBlogs] = useState([])
    const { axios, token } = useAppContext()

    const [ error, setError ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    const fetchBlogs = async () => {
        try {
            setLoading(true)
            setError(null)
            const { data } = await axios.get('/api/admin/blogs', { headers: { Authorization: `Bearer ${token}`} })
            if(data.success){
                setBlogs(data.blogs)
                setError(data.message)
            } else {
                toast.error(data.message)
                setError(data.message)
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
            fetchBlogs()
        }
    },[token])

  return !loading ? (
    <div className='flex-1 pt-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>

        {error && (
            <p className='text-red-500 mb-4'>{error}</p>
        )}

        <h1>All blogs</h1>

            <div className='relative h-4/5 mt-5 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
                <table className='w-full text-sm text-gray-500'>
                    <thead className='text-xs text-gray-600 text-left uppercase'>
                        <tr>
                            <th scope='col' className='px-2 py-4 xl:px-6'>#</th>
                            <th scope='col' className='px-2 py-4'>Blog Title</th>
                            <th scope='col' className='px-2 py-4 max-sm:hidden'>Date</th>
                            <th scope='col' className='px-2 py-4 max-sm:hidden'>Status</th>
                            <th scope='col' className='px-2 py-4'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((blog, index) => {
                            return <BlogTableItem key={blog.id} blog={blog} fetchBlogs={fetchBlogs} index={index + 1}/>
                        })}
                    </tbody>
                </table>
            </div>
    </div>
  ) : (
    <div className='flex items-center mx-auto'>
        <Loader />
    </div>
  )
}

export default ListBlog