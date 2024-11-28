import jwt from 'jsonwebtoken';
require("dotenv/config");

export const verifyToken= async(req, res,next )=>{
    const token = req.headers.token;
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
            if(err){
                res.status(403).json({success:false, message: "failed to authenticate User"})
            }
            else{
                req.decoded= decoded
                next()
            }
        })
    }else{
        return res.status(500).json({message: "no token provided"})
    }
}