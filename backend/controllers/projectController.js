const Project = require('../models/projectModel')
const mongoose = require('mongoose')
// const { MongoClient } = require('mongodb');
// const DB_NAME = 'tasksmanagement'; 
// const COLLECTION_NAME = 'projects';
//get all projects

const getProjects = async (req, res) => {
    try{
    const projects = await Project.find({}).sort({createdAt:'desc'});
    res.status(200).json(projects)
}
catch(error){res.status(400).json({error: error.message})}
}

// get number of all projects


const getProjectsCounter = async (req, res) => {
    // const client = new MongoClient(process.env.MONGODB_URI);
    try{
        const projectsCount = await Project.countDocuments({})
        res.status(200).json(projectsCount)
        console.log(projectsCount)
    }
    catch(error){res.status(400).json({error: error.message})}
    };
    
 

//get a single project
const getProject = async(req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such project'})
    }
    const project = await Project.findById(id)

    if(!project){
        return res.status(404).json({error: 'No such error'})
    }
    res.status(200).json(project)
}

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