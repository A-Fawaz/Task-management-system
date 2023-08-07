const Task = require('../models/task')
const Project = require('../models/projectModel')
const mongoose = require('mongoose')
//get all tasks
const getTasks = async (req, res) => {
    const tasks = await Task.find({})
    res.status(200).json(tasks)
}

async function getTasksWithProjectInfo(req, res) {
    try {
        const tasksWithProjectInfo = await Task.aggregate([
            {
                $lookup: {
                    from: 'projects', // The name of the collection you want to join (case-sensitive)
                    localField: 'projectId', // The field in the current collection (tasks) to match
                    foreignField: '_id', // The field in the referenced collection (projects) to match
                    as: 'project' // The name of the new array field that will contain the joined documents
                }
            },
            {
                $unwind: '$project' // If you want to flatten the 'project' array field
            }
        ]).sort({createdAt:'desc'});

        console.log(tasksWithProjectInfo)
        res.json(tasksWithProjectInfo);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}
//get a single task
const getTask = async(req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such task'})
    }
    const task = await Task.findById(id)

    if(!task){
        return res.status(404).json({error: 'No such error'})
    }
    res.status(200).json(task)
}
const getTasksCount = async (req, res) => {
    // const client = new MongoClient(process.env.MONGODB_URI);
    try{
        const tasksCount = await Task.countDocuments({})
        res.status(200).json(tasksCount)
        console.log(tasksCount)
    }
    catch(error){res.status(400).json({error: error.message})}
    };
//create new task
const createTask = async(req, res) => {
    const{taskName,assignTo,taskDescription,projectName,status, priority, dueDate,startDate,createdBy} = req.body
    console.log('Received task data:', req.body);
    console.log(taskName);
    const projectId = await Project.findOne({ project_name: projectName }).select('_id');

    try{
        const task = await Task.create({projectId:projectId,taskName:taskName,assignTo:assignTo,taskDescription:taskDescription,projectName:projectName, status:status,priority:priority, dueDate:dueDate,startDate:startDate,createdBy:createdBy})
        
        res.status(200).json(task)
    }catch(error){res.status(400).json({error: error.message})
}


}

//delete a task
const deleteTask = async(req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such Task'})
    }
    const task = await Task.findOneAndDelete({_id:id})
    if(!task){
        return res.status(400).json({error: 'No such error'})
    }
    res.status(200).json(task)
}

//update a task
const updateTask = async(req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: ' No such task'})
    }
    const task = await Task.findOneAndUpdate({_id:id}, {
        ...req.body
    })
    if(!task){
        return res.status(400).json({error: 'No such error'})
    }
    res.status(200).json(task)
}


module.exports = {
    getTasks,
    getTask,
    createTask,
    deleteTask,
    updateTask,
    getTasksCount,
    getTasksWithProjectInfo

}