import React, { useState } from 'react'
import { assets, blogCategories } from '../../assets/assets'
import Quill from 'quill'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
// import {parse} from 'marked'

const AddBlog = () => {

    const {axios, token} = useAppContext()

    const [ isAdding, setIsAdding ] = useState(false)

    const [ image, setImage ] = useState(false)
    const [ title, setTitle ] = useState('')
    const [ subTitle, setSubTitle ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ category, setCategory ] = useState('Startup')
    const [ isPublished, setIsPublished ] = useState(false)

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            setIsAdding(true)

            const blog = {
                title,
                subTitle, 
                description,
                category,
                isPublished
            }

            const formData = new FormData();
            formData.append('blog',JSON.stringify(blog)) 
            formData.append('image', image)

            const {data} = await axios.post('/api/blog/add', formData, { headers: { Authorization: `Bearer ${token}`} });
            if(data.success){
                toast.success(data.message)
                setImage(false)
                setTitle('')
                setDescription('')
                setCategory('')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsAdding(false)
        }
    }

  return (
    <form onSubmit={onSubmitHandler} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'>
        <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>
            
            <p>Upload Thumbnail</p>
            <label htmlFor="image">
                <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" className='mt-2 h-16 rounded cursor-pointer'/>
                <input 
                    onChange={(e) => setImage(e.target.files[0])} 
                    type="file" 
                    id='image' 
                    hidden 
                    required
                />
            </label>

            <p className='mt-4'>Blog Title</p>
            <input 
                type="text" 
                placeholder='Type here' 
                className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' 
                onChange={e => setTitle(e.target.value)}  
                value={title}
                required
            />

            <p className='mt-4'>Sub Title</p>
            <input 
                type="text" 
                placeholder='Type here' 
                className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' 
                onChange={e => setSubTitle(e.target.value)}  
                value={subTitle}
                required
            />

            <p className='mt-4'>Blog Description</p>
            <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
                <textarea 
                  placeholder='Type here'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded h-[280px]'
                />
            </div>  

            <p className='mt-4'>Blog Category</p>
            <select onChange={(e) => setCategory(e.target.value)} name="category" className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded'>
                <option value="">Select category</option>
                {blogCategories.map((item, index) => {
                    return <option key={index} value={item}>{item}</option>
                })}
            </select>

            <div className='flex gap-2 mt-4'>
                <p>Publish Now</p>
                <input type="checkbox" checked={isPublished} className='scale-125 cursor-pointer' onChange={e => setIsPublished(e.target.checked)} />
            </div>

            <button disabled={isAdding} type='submit' className='mt-8 w-40 h-10 bg-purple-600 text-white rounded cursor-pointer text-sm'>
                {isAdding ? 'Adding...' : 'Add Blog'}
            </button>

        </div>
    </form>
  )
}

export default AddBlog