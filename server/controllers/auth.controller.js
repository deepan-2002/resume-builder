import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User Already Exists" });

        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: "User Created" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User doesn't exists" });
        if (!(await user.matchPassword(password))) return res.status(400).json({ message: "Incorrect Password" });

        const token = generateToken(user._id);
        res.status(200).json({ message: "Logged In", token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
}