import pool from "../configs/db.js";

// Controller for Get admin dashboard data
export const getDashboard = async (req, res) => {
    try {

        // Get recent blogs
        const recentBlogsResult = await pool.query(
            "SELECT * FROM blogs ORDER BY created_at DESC LIMIT 5"
        );

        // Count total blogs
        const blogsResult = await pool.query(
            "SELECT COUNT(*) FROM blogs"
        );


        // Count drafts (is_published = false)
        const draftsResult = await pool.query(
            "SELECT COUNT(*) FROM blogs WHERE is_published = false"
        );

        const dashboardData = {
            blogs: parseInt(blogsResult.rows[0].count),
            drafts: parseInt(draftsResult.rows[0].count),
            recentBlogs: recentBlogsResult.rows
        };

        res.status(200).json({ success: true, dashboardData });

    } catch (error) {
        console.error("Dashboard Error :", error)
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller for Get All blogs in Admin
export const getAllBlogsAdmin = async (req, res) => {
    try {

        const result = await pool.query(
            "SELECT * FROM blogs ORDER BY created_at DESC"
        );

        if(result.rows.length === 0){
            return res.status(404).json({ success: false, message: "No blogs found"})
        }

        res.status(200).json({success: true,  blogs: result.rows});

    } catch (error) {
        console.error("Get Blogs Error :", error)
        res.status(500).json({ success: false, message: error.message });
    }
};
