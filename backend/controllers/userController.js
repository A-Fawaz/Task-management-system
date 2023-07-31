const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')


const createToken = (res, _id) => {
    const token =  jwt.sign({_id}, process.env.SECRET, {expiresIn: '1d'})
    res.cookie('jwt',token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 24 *60 *60 *1000
       })
 }
 
  
//get all users
const getUsers = async (req, res) => {
    const users = await User.find({}).sort({createdAt:'desc'});
    res.status(200).json(users)
}
// get users count
const getUsersCount = async (req, res) => {
    // const client = new MongoClient(process.env.MONGODB_URI);
    try{
        const usersCount = await User.countDocuments({})
        res.status(200).json(usersCount)
        console.log(usersCount)
    }
    catch(error){res.status(400).json({error: error.message})}
    };

//get a single User
const getUser = async(req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such user'})
    }
    const user = await User.findById(id)

    if(!user){
        return res.status(404).json({error: 'No such error'})
    }
    res.status(200).json(user)
}

//create new user
// const createUser = async(req, res) => {
//     const{username, email, status, password, role} = req.body

//     //add doc to db
//     try{
//         const user = await User.create({username, email, status, password, role})
//         res.status(200).json(user)
//     }catch(error){res.status(400).json({error: error.message})}


// }

//login user
const loginUser = async (req, res) => {
    const {email, password} = req.body

    try{
        const user = await User.login(email, password)
        //create token
        const token = createToken(res,user._id)
        res.status(200).json({email,token})
    }catch(error){
        res.status(400).json({error: error.message})
    }
    
    // res.json({mssg: 'login user'})
}
//signup user
const signupUser = async (req, res) => {
    const {username,email, password,status,role} = req.body

    try{
        const user = await User.signup(username,email, password,status,role)
        //create token
        const token = createToken(res,user._id)
        res.status(200).json({username,email,token,status,role})
    }catch(error){
        res.status(400).json({error: error.message})
    }
    // res.json({mssg: 'signup user'})
}

//logout user

const logoutUser = asyncHandler(async(req, res) => {
   res.cookie('jwt','', {
    httpOnly:true,
    expires: new Date(0)
   }) 
    
    res.status(200).json({message: 'Logout User'})
})

//delete a user
const deleteUser = async(req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such User '})
    }
    const user = await User.findOneAndDelete({_id:id})
    if(!user){
        return res.status(400).json({error: 'No such error'})
    }
    res.status(200).json(user)
}

//update a user
const updateUser  = async(req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such user'})
    }
    const user = await User.findOneAndUpdate({_id:id}, {
        ...req.body
    })
    if(!user){
        return res.status(400).json({error: 'No such error'})
    }
    res.status(200).json(user)
}



module.exports = {
    getUsers,
    getUser,
    // createUser,
    deleteUser,
    updateUser,
    signupUser,
    loginUser,
    logoutUser,
    getUsersCount
}  