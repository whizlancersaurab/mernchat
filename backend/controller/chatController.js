const { isValidObjectId } = require('mongoose');
const Chat = require('../models/chatModel');

// ✅ Send a new message
exports.sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { recieverId, text } = req.body;

        // ✅ Validation
        if (!isValidObjectId(senderId) || !isValidObjectId(recieverId)) {
            return res.status(400).json({ message: 'Invalid sender or receiver ID', success: false });
        }

        if (!text) {
            return res.status(400).json({ message: 'Message text is required', success: false });
        }

        // ✅ Save to DB
        const newChat = new Chat({
            senderId,
            recieverId,
            text,
            status: '1'
        });

        await newChat.save();

        return res.status(201).json({ message: 'Message sent successfully!', success: true, newChat });

    } catch (error) {
        console.error("Send message error:", error);
        return res.status(500).json({ message: 'Internal server error', success: false });
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
