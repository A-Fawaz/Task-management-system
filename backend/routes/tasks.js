const express = require('express')
const{
    createTask,
    getTasks,
    getTask,
    deleteTask,
    updateTask,
    getTasksCount,
    getTasksWithProjectInfo
} = require('../controllers/taskController')
const { protect } = require('../middleware/authMiddleware');
const router = express.Router()

//GET all tasks
router.get('/', getTasks)
// get task count
router.get('/count', getTasksCount)

router.get('/TasksWithProjectInfo', getTasksWithProjectInfo)

//GET a single task
router.get('/:id',getTask)

//POST a new task

router.post('/', createTask)

//DELETE a task 
router.delete('/:id',deleteTask)
//update a task
router.patch('/:id', updateTask)

module.exports = router  