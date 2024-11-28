import bcrypt from 'bcrypt';
import User from '../model/userModel.js'
import jwt from 'jsonwebtoken'
import path from 'path'

export const addUser = async(req, res)=>{
    try{
        const {firstName ,lastName, age, email, userName, password} = req.body;
        const image= req.file?.path;
        const oldUser = await User.findOne({email: email});
        if(oldUser)
        {
            return res.status(404).json({message: "user already register"})
        }
        
        const hashPass = await bcrypt.hash(password,10);        
        
        const newUser = new User({
            firstName,
            lastName,
            age,
            email,
            userName,
            password:hashPass,
            image:image
        })
        console.log(newUser)
        await newUser.save();
        return res.status(200).json({message:" new user created " , userData: newUser})
    }
    catch(error)
    {
        console.error(error)
        return res.status(500).json("error while creating  user")
    }
};

export const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email : email });
        if(!user){
            return res.status(404).json({message: "user not found"})
        }
        const is_match= await bcrypt.compare(password, user.password)
        if(!is_match){
            return res.status(404).json({message:"invalid credentials"})
        }
        const token = await jwt.sign({email: user.email, id : user._id}, 'your_secret_key',{expiresIn: '1h'})
        return res.status(200).json({message : "login success", token: token})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "error while login "})
    }
}

export const getUser = async(req, res)=>{
    try {
        const userData = await User.find();
        console.log(userData);
        
        return res.status(200).json({userData: userData})
    } catch (error) {
        console.error(error);
        return res.status(500).json("error while getting user information")
    }
}

export const getUserById= async(req, res)=>{
    try {
        const id= req.params.id
        const userData = await User.findOne({_id: id})
        if(!userData){
            return res.status(404).json({message: "user not found"})
        }
        return res.status(200).json({message: "user Information", userData: userData })
    } catch (error) {
        console.error(error);
        return res.status(500).json('error while getting user information')
    }
}


export const deleteUserById= async(req,res)=>{
    try {
        const id= req.params.id;
        const user= await User.findById({_id: id})
        if(!user){
            return res.status(404).json({message:"user not found "})
        }
        await User.deleteOne({_id: id})
        return res.status(200).json({message: " user deleted successfully "}) 

    } catch (error) {
        console.error(error)
        return res.status(500).json({message: "error while deleting user"})
    }
}

export const updateUser = async(req,res)=>{
    try {
        const id = req.params.id;
        const {firstName ,lastName, age, email, userName, password} = req.body;
        if( !firstName && !lastName && !age && !email && !userName && !password){
            return res.status(404).json({message: "not provide the req body "})
        }
        const updateData ={};
        if(firstName ){
            updateData.firstName= firstName 
        }
        if(lastName ){
            updateData.lastName= lastName 
        }
        if(age){
            updateData.age= age
        }
        if(email){
            updateData.email = email
        }
        if(userName){
            updateData.userName= userName
        }
        if(password){
            const hashPass = await bcrypt.hash(password, 10)
            updateData.password = hashPass
        }
        const updateUser = await User.findByIdAndUpdate(
            id,
            updateData,
            {new: true}
        )
        if(!updateUser){
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({message: "userdata updated", userData : updateUser})
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({message:"error while updateing information "})
    }
}

export const changepassword= async(req,res)=>{
    try {
        const userdetails = req.decoded.id;
        const {oldPassword, newPassword, confirmPassword } = req.body;
        const details =await User.findOne({_id:userdetails})

        const checkOldPassword = await bcrypt.compare(oldPassword, details.password)
        if(!checkOldPassword){
            return res.status(404).json({message:"old password not matched" })
        }
        if(newPassword !== confirmPassword){
            return res.status(404).json({message: " confirmpassword and newpassword not matched"})
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, details.password);
        details.password= hashedNewPassword;
        await details.save()
       

        return res.status(200).json({message: "password changed "})



    } catch (error) {
        console.error(error.message);
        return res.status(500).json({message: " error while chnaging password "})
    }
}