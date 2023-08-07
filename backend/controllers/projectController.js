const Project = require('../models/projectModel')
const mongoose = require('mongoose')


const getProjects = async (req, res) => {
    try{
    const projects = await Project.find({})
    res.status(200).json(projects)
}
catch(error){res.status(400).json({error: error.message})}
}



//get a single project
const getProject = async (req, res) => {
    const  { creatorId } = req.query;
  console.log(creatorId);
    try {
      const projects = await Project.find( {creatorId} , 'project_name'); // Fetch only the 'project_name' field for projects with the specified creatorId
      const projectNames = projects.map((project) => project.project_name);
      if (projectNames =="") {
        console.log("empty");
        
      }else{
        console.log(projectNames);
      }
      res.json(projectNames);
    } catch (error) {
      console.error('Error fetching project names:', error);
      res.status(500).json({ message: 'Failed to fetch project names' });
    }
  };

//create new project
const createProject = async(req, res) => {
    const{project_name, creatorId,project_description} = req.body

    //add doc to db
    try{
        const project = await Project.create({project_name, creatorId,project_description})
        res.status(200).json(project)
    }catch(error){res.status(400).json({error: error.message})}


}

//delete a project
const deleteProject = async(req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such Project'})
    }
    const project = await Project.findOneAndDelete({_id:id})
    if(!project){
        return res.status(400).json({error: 'No such error'})
    }
    res.status(200).json(project)
}

const getProjectsCounter = async (req, res) => {
  // const client = new MongoClient(process.env.MONGODB_URI);
  try{
      const projectsCount = await Project.countDocuments({})
      res.status(200).json(projectsCount)
      console.log(projectsCount)
  }
  catch(error){res.status(400).json({error: error.message})}
  };
  

//update a project
const updateProject = async(req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such Project'})
    }
    const project = await Project.findOneAndUpdate({_id:id}, {
        ...req.body
    })
    if(!project){
        return res.status(400).json({error: 'No such error'})
    }
    res.status(200).json(project)
}


module.exports = {
    getProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject,
    getProjectsCounter
}