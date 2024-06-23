const User = require("../models/user.model.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerController = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });
        user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: "User Created Successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed Creating User' });
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email doesn't exists" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect Password" });

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ message: "Logged In", token });
    } catch (err) {
        return res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = { registerController, loginController };