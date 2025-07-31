const express = require('express')
const verifyToken = require('../middleware/verifyToken')
const chatController = require('../controller/chatController')
const upload = require('../multer/uploadFile')



const router = express.Router()

router.post('/sendmessage', verifyToken, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
]), chatController.sendMessage)

router.get('/getmessage/:id', verifyToken, chatController.getMessage)

router.delete('/deletemessage/:id', verifyToken, chatController.deleteMessage)




module.exports = router