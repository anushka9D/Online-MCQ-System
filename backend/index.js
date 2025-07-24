const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

require('dotenv').config();

//Middleware
app.use(cors());
app.use(express.json());

//Route
app.use("/users",require("./routes/userRoutes"));
app.use("/exams",require("./routes/examRoutes"));

//Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("mongoo db url connected");
        app.listen(process.env.PORT);
        console.log(`app running in port ${process.env.PORT}`);
    })
    .catch((err)=>{
        console.log(err);
    })