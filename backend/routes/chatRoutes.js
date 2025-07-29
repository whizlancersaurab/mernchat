const express = require('express')
const verifyToken = require('../middleware/verifyToken')
const chatController =require('../controller/chatController')



const router = express.Router()

router.post('/sendmessage' ,verifyToken ,  chatController.sendMessage)
router.get('/getmessage' ,verifyToken ,  chatController.getMessage)


module.exports = router