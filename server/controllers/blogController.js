import fs from "fs";
import imagekit from "../configs/imageKit.js";
import pool from "../configs/db.js";

// Controller for create a new blog
export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);

    const imageFile = req.file;

    if (!title || !description || !category || !imageFile) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    //  Read file
    const fileBuffer = fs.readFileSync(imageFile.path);

    //  Upload to ImageKit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    // Optimize Image
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" },
      ],
    });

    const image = optimizedImageUrl;

    await pool.query(
      `INSERT INTO blogs 
       (title, subtitle, description, category, image, is_published) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [title, subTitle, description, category, image, isPublished || false]
    );

    res.status(201).json({ success: true, message: "Blog added successfully" });

  } catch (error) {
    console.error("Addblog Error :",error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller for get in All Blogs
export const getAllBlogs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM blogs WHERE is_published = true ORDER BY created_at DESC"
    );

    if(result.rows.length === 0){
      return res.status(404).json({ success: false, message: "No blogs found"})
    }

    res.status(200).json({ success: true, blogs: result.rows });

  } catch (error) {
    console.error("All blogs Error :", error)
    res.status(500).json({ success: false, message: error.message });
  }
};

//Controller for get in single blog by id
export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;

    const result = await pool.query(
      "SELECT * FROM blogs WHERE id = $1",
      [blogId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, blog: result.rows[0] });

  } catch (error) {
    console.error("Blog Id Error :", error)
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Blog (Title & Description)
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and Description are required" });
    }

    const result = await pool.query(
      `UPDATE blogs
       SET title = $1,
          description = $2,
          updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [title, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, message: "Blog updated successfully", blog: result.rows[0] });

  } catch (error) {
    console.error("Update Blog Error :", error)
    res.status(500).json({ success: false, message: error.message });
  }
};


//Controller for delete blog Post
export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;

    const result = await pool.query(
      "DELETE FROM blogs WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, message: "Blog deleted successfully" });

  } catch (error) {
    console.error("Delete Blog Error :", error)
    res.status(500).json({ success: false, message: error.message });
  }
};

//Controller for blog publish 
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;

    const result = await pool.query(
      `UPDATE blogs
       SET is_published = NOT is_published,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, message: "Blog status updated" });

  } catch (error) {
    console.error("Toggle Publish Error :", error)
    res.status(500).json({ success: false, message: error.message });
  }
};
