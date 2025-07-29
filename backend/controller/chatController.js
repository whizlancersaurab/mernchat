const { isValidObjectId } = require('mongoose');
const Chat = require('../models/chatModel')




exports.sendMessage = async (req, res) => {
    try {

        const senderId = req.user.id;

        const { recieverId, text } = req.body;

        if (!isValidObjectId(senderId) || !isValidObjectId(recieverId)) {
            return res.status(404).json({ message: 'Invalid senderID or RecieverId', success: false })

        }

        if (!senderId || !recieverId || !text) {
            return res.status(404).json({ message: 'Required all fields !', success: false })

        }

        const newChat = new Chat({
            senderId,
            recieverId,
            text,
            status: '1'
        })

        await newChat.save();

        return res.status(201).json({ mesage: 'Message send successFully !', success: true, newChat })

    } catch (error) {
        console.log(`Chat send Error`, error)
        return res.status(500).json({ message: 'Internal server errror !', success: false })
    }
}



exports.getMessage = async (req, res) => {
    try {
        const senderId = req.user.id

        if (!isValidObjectId(senderId)) {
            return res.status(404).json({ message: 'Invalid id', success: false })

        }

        const allMessage = await Chat.find().sort({createdAT:1}).populate('senderId' , 'firstname lastname email').populate('recieverId' , 'firstname lastname email')
        return res.status(200).json({ message: 'Message fetched successFully !', success: true, allMessage })
    } catch (error) {
        console.log(`Chat send Error`, error)
        return res.status(500).json({ message: 'Internal server errror !', success: false })

    }
}