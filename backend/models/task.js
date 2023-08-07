const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  projectName:{
type: String,
required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
},
  taskName: {
    type: String,
    required: true
  },
  taskDescription: {
    type: String,
    required: true
  },
  assignTo: {
    type: String,
    required: true
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date
  },
  startDate: {
    type: Date
  },

  status: {
    type: String,
    enum: ['to-do', 'in-progress', 'completed'],
    default: 'to-do'
  },
  priority:{
    type: String,
    required:true
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

  
 