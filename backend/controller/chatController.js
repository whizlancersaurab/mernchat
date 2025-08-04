const { isValidObjectId, deleteModel } = require('mongoose');
const Chat = require('../models/chatModel');
const fs = require('fs')
const path = require('path');


exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { recieverId, text } = req.body;


    if (!isValidObjectId(senderId) || !isValidObjectId(recieverId)) {
      return res.status(400).json({
        message: 'Invalid sender or receiver ID',
        success: false,
      });
    }


    const newChat = new Chat({
      senderId,
      recieverId,
      text: text || null,
      status: '1',
    });

    // console.log( req.files.image[0].filename)
    if (req.files?.image?.[0]) {
      newChat.image = req.files.image[0].filename;
      newChat.messageType = 'img'
    }

    if (req.files?.audio?.[0]) {
      newChat.audio = req.files.audio[0].filename;
      newChat.messageType = 'audio'
    }

    await newChat.save();

    return res.status(201).json({
      message: 'Message sent successfully!',
      success: true,
      newChat,
    });
  } catch (error) {
    console.error("❌ Send message error:", error);
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};


// ✅ Get all messages between 2 users
exports.getMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const recieverId = req.params.id;

    if (!isValidObjectId(senderId) || !isValidObjectId(recieverId)) {
      return res.status(400).json({ message: 'Invalid user IDs', success: false });
    }

    const allMessage = await Chat.find({
      $or: [
        { senderId: senderId, recieverId: recieverId },
        { senderId: recieverId, recieverId: senderId }
      ]
    })
      .sort({ createdAt: 1 }) // ✅ Correct timestamp
      .populate('senderId', 'firstname lastname email')
      .populate('recieverId', 'firstname lastname email');

    return res.status(200).json({ message: 'Messages fetched successfully!', success: true, allMessage });

  } catch (error) {
    console.error("Fetch message error:", error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};




exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const CurrentsenderId = req.user.id;


    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid message ID', success: false });
    }

    const message = await Chat.findById(id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found', success: false });
    }

    if(CurrentsenderId!=message.senderId){
      return res.status(404).json({message:'Not a valid user !' , success:false})

    }

    const deleteFileIfExists = (filePath) => {
      const fullPath = path.join(__dirname, '..', 'uploads', filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    };

    if (message.image) {
      deleteFileIfExists(message.image);
    }

    if (message.audio) {
      deleteFileIfExists(message.audio);
    }


    // ✅ Delete message from database
    const deletedMessage = await Chat.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Message deleted successfully!',
      success: true,
      deletedMessage,
    });

  } catch (error) {
    console.error('❌ Delete Message Error:', error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};

