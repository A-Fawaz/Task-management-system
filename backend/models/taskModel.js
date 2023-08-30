const mongoose = require('mongoose')

const Schema = mongoose.Schema

const taskSchema = new Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
         required: true 
       },
    task_name: {
        type: String,
        required: true
    },
    task_description: {
        type: String,
        required: false
    },
    status:{
        type: String,
        enum: ['Open', 'InProgress', 'Close'],
        default: 'Open'
    },
    priority:{
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },
    due_date: {
        type: Date,
        required: true
    },
    StartTime:{
        type: Date,
        required: true
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId, // Store user IDs
        ref: 'User', // Reference the user collection/model
        required: false
    }
    
},{timestamps:true}
);

module.exports = mongoose.model('task', taskSchema )