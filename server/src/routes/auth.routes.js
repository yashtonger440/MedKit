import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import { JWT_SECRET } from "../config/env.js"

const router = express.Router();

// signup part
router.post("/signup", async (req,res) => {
    const { name, email, password } = req.body;

    const exists = await User.findOne({email});
    if(exists) return res.json({message: "User exists"});

    const hashed = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashed });

    res.json({ message: "Signup success"});
})

// login part
router.post("/login", async (req,res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({message: "User not found"});  

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json({message: "Email or password is incorrect"});

    const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.status(200).json({ token, user });
});

export default router;