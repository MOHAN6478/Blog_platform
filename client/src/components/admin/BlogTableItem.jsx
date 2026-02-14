import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const BlogTableItem = ({blog, fetchBlogs, index}) => {

    const { title, created_at } = blog;
    const BlogDate = new Date(created_at)

    const { axios, token } = useAppContext()

    const deleteBlog = async () => {
        const confirm = window.confirm('Are you sure you want to delete this blog?')
        if(!confirm) return;
        try {
            const { data } = await axios.delete('/api/blog/delete',{ data: { id: blog.id }}, { headers: { Authorization: `Bearer ${token}`} })
            if(data.success){
                toast.success(data.message)
                await fetchBlogs()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const togglePublish = async () => {
        try {
            const {data} = await axios.put('/api/blog/toggle-publish',{id: blog.id}, { headers: { Authorization: `Bearer ${token}`} })
            if(data.success){
                toast.success(data.message)
                await fetchBlogs()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <tr className='border-y border-gray-300'>
        <th className='px-2 py-4'>{index}</th>
        <td className='px-2 py-4'>{title}</td>
        <td className='px-2 py-4 max-sm:hidden'>{BlogDate.toDateString()}</td>
        <td className='px-2 py-4 max-sm:hidden'>
            <p className={ `border-2 px-2 py-0.5 rounded w-max ${blog.is_published ? "text-green-600 bg-green-300/30 border-green-800" : "text-orange-700 border-orange-800 bg-red-300/50"}`}>
                {blog.is_published ? 'Published' : 'Unpublished'}
            </p>
        </td>
        <td className='px-2 py-4 flex text-xs gap-3'>
            <button onClick={togglePublish} className='border px-2 py-0.5 mt-1 rounded cursor-pointer'>
                {blog.is_published ? 'Unpublish' : 'Publish'}
            </button>
            <div>
                <img onClick={deleteBlog} src={assets.trash} className='size-6 hover:scale-110 transition-all cursor-pointer' alt="" />
            </div>
        </td>
    </tr>
  )
}

export default BlogTableItem