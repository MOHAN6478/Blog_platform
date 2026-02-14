import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import blogRouter from './routes/blogRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import authRouter from './routes/authRoutes.js';

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())

const PORT = process.env.PORT || 3000 ;

// Routes
app.use('/api/blog', blogRouter)
app.use('/api/admin', adminRouter)
app.use('/api/auth', authRouter)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})