import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../configs/db.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


//Controller for Register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password){
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await pool.query(
            "INSERT INTO admins (name, email, password) VALUES ($1,$2,$3) RETURNING *",
            [name, email, hashedPassword]
        );

        res.status(201).json({ success: true, message: "Registered successfully" });

    } catch (error) {
        console.error("Register Error :", error)
        res.status(500).json({ success: false, message: error.message });
    }
};


// Controller for Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password){
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const user = await pool.query(
            "SELECT * FROM admins WHERE email=$1",
            [email]
        );

        if (user.rows.length === 0){
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);

        if (!isMatch){
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign( { id: user.rows[0].id, email }, process.env.JWT_SECRET, { expiresIn: "7d" } );

        res.status(200).json({ success: true, token });

    } catch (error) {
        console.error("Login Error :", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Controller for Google Login
export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        const user = await pool.query(
            "SELECT * FROM admins WHERE email=$1",
            [email]
        );

        let userData;

        if (user.rows.length === 0) {
            const newUser = await pool.query(
                "INSERT INTO admins (name,email,provider) VALUES ($1,$2,'google') RETURNING *",
                [name, email]
            );
            userData = newUser.rows[0];
        } else {
            userData = user.rows[0];
        }

        const jwtToken = jwt.sign( { id: userData.id, email }, process.env.JWT_SECRET, { expiresIn: "7d" } );

        res.status(200).json({ success: true, token: jwtToken });

    } catch (error) {
        console.error("Google Login Error :", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
