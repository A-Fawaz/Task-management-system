const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  memberName: {
    type: String,
    required: true
  },
  creatorName: {
    type: String,
    required: true
  },
  memberEmail: {
    type: String,
    required: true,
  },
  creatorEmail: {
    type: String,
    required: true
  },
  projectName: {
    type:String ,
    required: true
  },
 
  invited: {
    type: Boolean,
    default: false,
  }
  
});


const Team = mongoose.model('Team', teamSchema);
module.exports = Team;