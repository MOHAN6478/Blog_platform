import React, { useRef } from 'react'
import { useAppContext } from '../context/AppContext'

const Header = () => {

    const { setInput, input } = useAppContext()
    const inputRef = useRef()

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setInput(inputRef.current.value)
    }

    const onClear = () => {
        setInput('')
        inputRef.current.value = ''
    }

  return (
    <div className='mx-8 sm:mx-16 xl:mx-24 relative'>
        <div className='text-center mt-20 mb-8'>

            <h1 className='text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700 pb-10'>
                <span className='text-purple-500'>blogging</span> platform
            </h1>

            <form onSubmit={onSubmitHandler} className='flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden'>
                <input 
                    ref={inputRef} 
                    type="text" 
                    placeholder='Search for blogs' 
                    className='w-full pl-4 outline-none' 
                    required
                />
                <button type='submit' className='bg-purple-500 text-white px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer'>
                    Search
                </button>
            </form>

        </div>
        <div className='text-center'>
           {
            input && 
                <button onClick={onClear} className='border font-light text-xs py-1 px-3 rounded-sm shadow-custom-sm cursor-pointer'>
                    Clear Search
                </button>
            }
        </div>
    </div>
  )
}

export default Header