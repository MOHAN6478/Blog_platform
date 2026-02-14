import React from 'react'

const TotalBlog = ({blog, index}) => {

    const { title, created_at } = blog;
    const BlogDate = new Date(created_at)

  return (
      <tr className='border-y border-gray-300'>
          <th className='px-2 py-4'>{index}</th>
          <td className='px-2 py-4'>{title}</td>
          <td className='px-2 py-4 max-sm:hidden'>{BlogDate.toDateString()}</td>
          <td className='px-2 py-4 max-sm:hidden'>
              <p className={`border-2 px-2 py-0.5 rounded w-max ${blog.is_published ? "text-green-600 bg-green-300/30 border-green-800" : "text-orange-700 border-orange-800 bg-red-300/50"}`}>
                  {blog.is_published ? 'Published' : 'Unpublished'}
              </p>
          </td>
      </tr>
    )
}

export default TotalBlog