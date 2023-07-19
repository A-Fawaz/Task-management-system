const mongoose = require('mongoose');
const Joi = require('joi');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verficationtoken:{
        type: String,
        

    }

}, { timestamps: true });

userSchema.methods.validateRegisterUser = function(obj) {
    const schema = Joi.object({
        username: Joi.string().trim().min(2).max(100).required(),
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().trim().min(8).required(),
        isVerified: Joi.boolean().default(false)
    
    });
    return schema.validate(obj);
};

const User = mongoose.model('user', userSchema);

module.exports = {
    User
};
