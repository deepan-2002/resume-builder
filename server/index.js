const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth.route.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI);

app.use(express.json());
app.use('/api/auth', authRouter);

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));