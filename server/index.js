const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const authRoutes=require('./routes/auth');
const app=express();

dotenv.config();
app.use(express.json());
app.use(cors());

const PORT=process.env.PORT||5000;
const MONGO_URI=process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected!"))
    .catch((err) => console.log("Error connecting mongodb: ",err));

app.use('/api',authRoutes);
const questionRoutes = require('./routes/question');
app.use('/api/questions', questionRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}!`);
});