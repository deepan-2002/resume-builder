import { Schema, model } from "mongoose";

// const ResumeSchema = new Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
//     resume_name: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     contact: {
//         full_name: {
//             type: String,
//             required: true,
//             minlength: 3,
//         },
//         email: { type: String },
//         phone_number: { type: String },
//         linkedIn_url: { type: String },
//         website_url: { type: String },
//         country: { type: String },
//         state: { type: String },
//         city: { type: String },
//     },
//     experience: [{
//         company_name: { type: String },
//         role: { type: String },
//         from: { type: Date },
//         to: { type: Date },
//         location: { type: String },
//         description: { type: String }
//     }],
//     project: [{
//         project_title: { type: String },
//         organization: { type: String },
//         project_url: { type: String },
//     }]
// })

const ResumeSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    summary: { type: String },
    education: [
        {
            school: { type: String },
            degree: { type: String },
            fieldOfStudy: { type: String },
            from: { type: Date },
            to: { type: Date },
            description: { type: String },
        },
    ],
    experience: [
        {
            company: { type: String },
            title: { type: String },
            from: { type: Date },
            to: { type: Date },
            description: { type: String },
        },
    ],
    skills: { type: [String] },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Resume = model("Resume", ResumeSchema);

export default Resume;