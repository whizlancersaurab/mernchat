const express = require('express')
const userController =require('../controller/userControler');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/register' , userController.registerUser)
router.post('/login' , userController.loginUser)
router.get('/allusers' , userController.allUser)
router.get('/user/:id' , userController.getUserById)
router.get('/logout/' ,verifyToken, userController.logoutUser)
router.get('/currentuser' , verifyToken , userController.currentUser)
router.delete('/deleteuser/:id' ,verifyToken, userController.deleteUser)

module.exports = router