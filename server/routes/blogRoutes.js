import express from 'express'
import upload from '../middleware/multer.js';
import { addBlog, deleteBlogById, getAllBlogs, getBlogById, togglePublish, updateBlog } from '../controllers/blogController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const blogRouter = express.Router();

blogRouter.post('/add', upload.single('image'), authMiddleware, addBlog);
blogRouter.get('/all', getAllBlogs)
blogRouter.get('/:blogId', getBlogById)
blogRouter.put('/update/:id',authMiddleware ,updateBlog)
blogRouter.delete('/delete',authMiddleware, deleteBlogById)
blogRouter.put('/toggle-publish',authMiddleware, togglePublish)

export default blogRouter;