import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, "Name must contain atleast 3 Letters"],
        match: [/^[A-Za-z\s]+$/, "Enter Valid Name"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Enter Valid Email"],
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must contain atleast 6 characters"]
    }
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

UserSchema.methods.matchPassword = async function (enteredPassword) {
    await bcrypt.compare(enteredPassword, this.password);
}

const User = model('User', UserSchema);

export default User;