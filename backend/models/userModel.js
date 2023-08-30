const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Joi = require('joi')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username:{
        type: String,
        required: true
        
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'admin'
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    }
},{timestamps:true})

// static signup method
userSchema.statics.signup = async function ( username,email, password, role, status) {
    //validation
    // if(!email || !password || !username){
    //     throw Error('All field must be filled')
    // }
    // if(!validator.isEmail(email)){
    //     throw Error('Email is not valid')
    // // }
    // if(!validator.isStrongPassword(password)){
    //     throw Error('password is not strong enough')
    // }
    const Joi = require('joi');

// Define the validation schema
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  username: Joi.string().min(3).required()
});

// // Perform the validation
// const validationResult = schema.validate({ email, password, username });

// // Check for validation errors
// if (validationResult.error) {
//   throw new Error(validationResult.error.details[0].message);
// }

    
    const exists = await this.findOne({email})

    if (exists){
        throw Error('Email already in use')
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({username,email, password: hash, role,status})
    return user
}

//static login method
userSchema.statics.login = async function (email, password) {
    if(!email || !password){
    throw Error('All field must be filled')

}
const user = await this.findOne({email})


if (!user){
    throw Error('Incorrect email')
}
const match = await bcrypt.compare(password, user.password)

if(!match){
    throw Error('Incorrect password')

}
return user
}
module.exports = mongoose.model('user', userSchema )