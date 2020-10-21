const db=require("../models/index");
const jwt = require("jsonwebtoken");

exports.signin=async function(req,res,next){
    // finding a user
    try {
        let user=await db.User.findOne({
            email: req.body.email
        });
        let {id, username, profileImageUrl}=user;
        let isMatch=await user.comparePassword(req.body.password);
        if(isMatch){
            let token=jwt.sign({
                id,
                username,
                profileImageUrl
            },
            process.env.SECRET_KEY
            );
            return res.status(200).json({
                id,
                username,
                profileImageUrl,
                token
            })
        }else{
            return next({
                status:400,
                message:"Invalid Email/Password"
            });
        }        
    } catch (error) {
        return next({
            status:400,
            message:"Invalid Email/Password"
        });
    }
}

exports.signup=async function (request,response,next){
    try{
        // Crate a user
        let user=await db.User.create(request.body);
        let {id, username, profileImageUrl}=user;
        // create a token (signing a token)
        let token=jwt.sign({
            id,
            username,
            profileImageUrl
            },
            process.env.SECRET_KEY
        );
        return response.status(200).json({
            id,
            username,
            profileImageUrl,
            token
        });
    }catch(err){
        // if a validation fails
        if(err.code===11000){
            err.message='Sorry, that username/email is taken'
        }
        return next({
            status:400,
            message:err.message
        })
    }
}