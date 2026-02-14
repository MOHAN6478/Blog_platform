import express from 'express'
import { getAllBlogsAdmin, getDashboard } from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const adminRouter = express.Router();

adminRouter.get('/dashboard',authMiddleware ,getDashboard);
adminRouter.get('/blogs', authMiddleware ,getAllBlogsAdmin);

export default adminRouter;