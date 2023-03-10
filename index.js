require("dotenv").config();
const express = require('express');
const app=express();
const cors=require('cors')
const bodyParser=require('body-parser');
const errorHandler=require("./handlers/error");
const authRoutes=require("./routes/auth");
const messagesRoutes=require('./routes/messages');
const{loginRequired,ensureCorrectUser}=require("./middleware/auth");
const db  = require("./models");

const PORT=process.env.PORT||8081;

app.use(cors());
app.use(bodyParser.json());

// all my routes go here
app.use("/api/auth",authRoutes);
app.use("/api/users/:id/messages",
loginRequired,
ensureCorrectUser,
messagesRoutes);

app.get("/api/messages",loginRequired,async function(req, res,next){
    try {
        let messages=await db.Message.find().sort({createdAt:"desc"}).populate("user",{
            username:true,
            profileImageUrl:true
        });
        return res.status(200).json(messages);
    } catch (error) {
        return next(error);
    }
})

app.use(function (req,res,next){
    let err = new Error('Not Found');
    err.status=404;
    next(err);
})

app.use(errorHandler);

db.connectDB().then(()=>{
    app.listen(PORT,function (){
        console.log(`Server is started on port ${PORT}`)
    })  
})