const express = require('express')
const{
    getUsers,
    getUser,
    // createUser,
    deleteUser,
    updateUser,
    signupUser,
    loginUser,
    logoutUser,
    getUsersCount
} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware.js')
const router = express.Router()

// login route
router.post('/login', loginUser)

//signup route 
router.post('/signup', signupUser)

//logout user

router.post('/logout', logoutUser)


//GET all users
router.get('/',getUsers)

//Get users count
router.get('/count',getUsersCount)
//GET a single user
router.get('/:id',getUser)

//POST a new task

// router.post('/', createUser)

//DELETE a user 
router.delete('/:id',deleteUser)
//UPDATE a user
router.patch('/:id',protect,updateUser)

module.exports = router