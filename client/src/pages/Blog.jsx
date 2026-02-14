import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Navbar from '../components/Navbar'
import Moment from 'moment'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Blog = () => {
  const { id } = useParams()
  const { axios, token } = useAppContext()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  // Fetch blog data
  const fetchBlogData = async () => {
  try {
    setLoading(true)
    setError(null)

    const { data } = await axios.get(`/api/blog/${id}`)

    if(data.success){
      setData(data.blog)
      setName(data.blog.title)
      setContent(data.blog.description)
    } else {
      toast.error(data.message)
      setError(data.message)
    }
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
  }

  useEffect(() => {
    if(id){
      fetchBlogData()
    }
  }, [id])

  
  useEffect(() => {
    document.body.style.overflow = isEditing ? 'hidden' : 'auto'
  }, [isEditing])

  // Update handler
  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!name.trim()) return toast.error('Title is required')
    if (!content.trim()) return toast.error('Description is required')

    try {
      setError(null)

      await axios.put(`/api/blog/update/${id}`, { title: name, description: content }, { headers: { Authorization: `Bearer ${token}`} })

      setData(prev => ({
        ...prev,
        title: name,
        description: content,
      }))

      toast.success('Blog updated successfully')
      setIsEditing(false)
    } catch (err) {
      setError('Failed to update blog')
      toast.error('Update failed')
      console.log(err)
    }
  }

  if (loading) return <Loader />

  if (error && !isEditing) {
    return (
      <div className="text-center mt-20 text-red-600">
        <Navbar />
        <p className="text-lg font-medium">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative">
      
      <div className={isEditing ? 'blur-sm pointer-events-none' : ''}>
        <Navbar />

        {/* Blog Header */}
        <div className="text-center mt-20 text-gray-600">
          <p className="text-purple-600 py-4 font-medium">
            Published on {Moment(data.created_at).format('MMMM Do YYYY')}
          </p>

          <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">
            {data.title}
          </h1>

          <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-purple-500/35 bg-purple-900/5 font-medium text-purple-900 mt-4">
            Mohan
          </p>

        </div>

        {/* Blog Body */}
        <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
          <img src={data.image} alt="" className="rounded-3xl mb-5" />

          <div
            className="rich-text max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </div>
      </div>

      {/* EditPage */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ">
          <form
            onSubmit={handleUpdate}
            className="bg-white w-full max-w-2xl mx-4 p-6 rounded-2xl shadow-xl space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Edit Blog
            </h2>

            <p className='text-lg font-normal'>Title :</p>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Blog Title"
            />

            <p className='text-lg font-normal'>Description :</p>
            <textarea
              className="w-full border px-4 py-2 rounded h-40"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Blog Description"
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
      {token && (
        <button
        onClick={() => setIsEditing(true)}
        className="block mx-auto text-xl mt-4 px-10 py-4 bg-purple-800 text-white rounded mb-10 flex items-center gap-5"
        >
          <img src={assets.edit} alt="editIcon" className='h-6'/>
          Edit Blog
        </button>
      )}
    </div>
  )
}

export default Blog
