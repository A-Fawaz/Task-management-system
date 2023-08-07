const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    project_name: {
      type: String,
      required: true,
      unique:true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
       ref: 'User', required: true
      },
    project_description: {
      type: String,
      required: true
    },
  },{timestamps:true});

module.exports = mongoose.model('project', projectSchema )