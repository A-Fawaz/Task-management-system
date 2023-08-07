const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 


router.get('/',userController.getUsers)

//Get users count
router.get('/count', userController.getUsersCount)
//GET a single user
router.get('/:id',userController.getUser)

//POST a new task

// router.post('/', createUser)

//DELETE a user 
router.delete('/:id',userController.deleteUser)
//UPDATE a user
router.patch('/:id',userController.updateUser)
// Signup route
router.post('/signup', userController.signup);

// Login route
router.post('/login', userController.login);
router.post('/finding', userController.finding);

router.post('/invite', userController.invite);

// Verify account route
router.get('/verify/:verificationToken', userController.verifyAccount); 
router.get('/acceptinvitation/:verificationToken', userController.acceptinvitation); 
router.post('/forgot-password', userController.forgotPassword);

router.post('/reset-password/:token', userController.resetPassword);

router.get('/reset-password/:token', userController.handlePasswordResetLink);
router.post('/checking', userController.checking);



//router.post('/api/users/reset-password/:token', userController.resetPassword);

module.exports = router;
