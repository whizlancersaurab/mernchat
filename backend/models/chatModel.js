const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
      default:null
    },
    audio: {
      type: String,
      default:null
    },
    messageType:{
     type:String,
     enum:['text' ,'img' , 'audio'],
     default:'text'
    },
    status: {
      type: String,
      default: '0',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
