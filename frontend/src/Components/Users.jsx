import React, { useEffect, useState, useRef } from 'react';
import chatImg from '../assets/chat.jpg';
import { MdAddCall } from "react-icons/md";
import { CiVideoOn } from "react-icons/ci";
import axios from 'axios';
import { format, isToday, isYesterday } from 'date-fns';
import Chat from './Chat';
import UserList from './UserList';
import { useAudioRecorder } from 'use-audio-recorder';

const Users = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});
  const [storageData, setStorageData] = useState(null);
  const [messageData, setMessageData] = useState([]);
  const [formdata, setFormdata] = useState({
    recieverId: '',
    text: ''
  });
  const [currentUserId, setCurrentUserId] = useState(null);

  const chatAreaRef = useRef(null);

  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

  // Voice Recorder Hook
 const {
  startRecording,
  stopRecording,
  recordingBlob,
  isRecording,
} = useAudioRecorder({
  encoderBitRate: 128000,
  mimeType: 'audio/webm',
  onStart: () => console.log("Recording started"),
  onStop: (blob) => {
    console.log("Recording stopped:", blob);
  },
  onError: (err) => {
    console.error("🎙 Microphone error:", err);
    alert("Mic access denied or device not supported.");
  },
});


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/auth/allusers');
        setData(res.data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    setStorageData(JSON.parse(localStorage.getItem('user')));
    fetchData();
  }, []);

  const getMessage = async (id) => {
    try {
      const chatRes = await axios.get(`http://localhost:8080/api/chat/getmessage/${id}`, {
        headers: {
          Authorization: `Bearer ${storageData.token}`,
        },
      });
      if (chatRes.data.success) {
        setMessageData(chatRes.data.allMessage);
        setTimeout(scrollToBottom, 1);
      }
    } catch (error) {
      console.error("Error getting messages:", error);
    }
  };

  const handleUser = async (id) => {
    setCurrentUserId(id);
    try {
      const res = await axios.get(`http://localhost:8080/api/auth/user/${id}`);
      if (res.data.success) {
        getMessage(id);
        setUser(res.data.user);
        setFormdata((prev) => ({ ...prev, recieverId: res.data.user._id }));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleForm = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/api/chat/sendmessage`, formdata, {
        headers: {
          Authorization: `Bearer ${storageData.token}`,
        },
      });

      if (res.data.success) {
        setFormdata((prev) => ({ ...prev, text: '' }));
        getMessage(currentUserId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleVoiceSend = async () => {
    console.log(recordingBlob)
    if (!recordingBlob || !user._id) return;

    const file = new File([recordingBlob], 'voice-message.webm', {
      type: recordingBlob.type,
    });

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('recieverId', user._id);

    try {
      const res = await axios.post(`http://localhost:8080/api/chat/sendVoice`, formData, {
        headers: {
          Authorization: `Bearer ${storageData.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("✅ Voice message sent:", res.data);
      getMessage(currentUserId);
    } catch (err) {
      console.error("❌ Voice message failed:", err);
    }
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'hh:mm a');
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'hh:mm a')}`;
    } else {
      return format(date, 'dd MMM, hh:mm a');
    }
  };

  return (
    <div className="container">
      <div className="row vh-100">
        <UserList {...{ data, handleUser }} />
        <div style={{ backgroundColor: '#f3f0f0ff' }} className="col-12 col-sm-8 p-3">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3" style={{ height: '55px' }}>
            <div className="d-flex align-items-center">
              <img src={chatImg} alt="avatar" className="rounded-circle me-2" width={50} height={50} />
              <div>
                <div className="fw-bold">{user?.firstname || "Select a user"}</div>
                <div className="text-muted small">{user?._id ? "online" : "offline"}</div>
              </div>
            </div>
            <div className="d-flex gap-2">
              <CiVideoOn size={25} />
              <MdAddCall size={25} />
            </div>
          </div>

          <Chat {...{ messageData, chatAreaRef, formatMessageTime, storageData }} />

          <div className="mt-3 d-flex align-items-center">
            <input
              onChange={(e) => setFormdata((prev) => ({ ...prev, text: e.target.value }))}
              value={formdata.text}
              type="text"
              className="form-control me-2"
              placeholder="Type a message"
            />

            <button onClick={startRecording} disabled={isRecording} className="btn btn-outline-primary me-1">
              🎙
            </button>
            <button onClick={stopRecording} disabled={!isRecording} className="btn btn-outline-danger me-1">
              🛑
            </button>
            <button onClick={handleVoiceSend} disabled={recordingBlob} className="btn btn-primary me-1">
              📤
            </button>

            <button onClick={handleForm} disabled={!user._id || !formdata.text} className="btn btn-success">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
