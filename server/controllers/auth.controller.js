import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: "User Already Exists" });

        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ msg: "User Created" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: err.message });
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ msg: "User doesn't exists" });
        if (!user.matchPassword(password)) return res.status(400).json({ msg: "Incorrect Password" });

        const token = generateToken(user._id);
        res.status(200).json({ msg: "Logged In", token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server Error' });
    }
}