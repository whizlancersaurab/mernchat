import React, { useEffect, useState, useRef } from 'react';
import { AudioRecorder } from 'react-audio-voice-recorder';
import chatImg from '../assets/chat.jpg';
import { MdAddCall } from "react-icons/md";
import { CiVideoOn, CiImageOn } from "react-icons/ci";
import axios from 'axios';
import { format, isToday, isYesterday } from 'date-fns';
import Chat from './Chat';
import UserList from './UserList';
import { IoSend } from "react-icons/io5";

const Users = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});
  const [storageData, setStorageData] = useState(null);
  const [messageData, setMessageData] = useState([]);
  const [formdata, setFormdata] = useState({ recieverId: '', text: '' });
  const [currentUserId, setCurrentUserId] = useState(null);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const chatAreaRef = useRef(null);

  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

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
        headers: { Authorization: `Bearer ${storageData.token}` },
      });
      if (chatRes.data.success) {
        console.log(chatRes.data.allMessage)
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

  const handleSendMessage = async (voiceBlob = null) => {
    if (!user._id) return;
    // console.log(formdata)
    const sendData = new FormData();
    sendData.append('recieverId', formdata.recieverId);

    if (formdata.text.trim())
      sendData.append('text', formdata.text);

    if (image)
      sendData.append('image', image);

    if (voiceBlob) {
      const audioFile = new File([voiceBlob], "voice-messageData.webm", {
        type: voiceBlob.type
      });
      sendData.append('audio', audioFile);
    }


    //    for (let pair of sendData.entries()) {
    //       console.log(`${pair[0]}: ${pair[1]}`);

    // }

    try {
      const res = await axios.post(`http://localhost:8080/api/chat/sendmessage`, sendData, {
        headers: {
          Authorization: `Bearer ${storageData.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setFormdata((prev) => ({ ...prev, text: '' }));
        setImage(null);
        setPreviewUrl(null)
        getMessage(currentUserId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setTimeout(scrollToBottom, 1);
  };


  const handelCancel = () => {
    setFormdata((prev) => ({ ...prev, text: '' }))
    setPreviewUrl(null)
    setImage(null)
  }

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return format(date, 'hh:mm a');
    if (isYesterday(date)) return `Yesterday, ${format(date, 'hh:mm a')}`;
    return format(date, 'dd MMM, hh:mm a');
  };

  const handleDelete = async (id) => {
    // console.log(id)
    try {
      if (!id) {
        return;
      }

      const res = await axios.delete(`http://localhost:8080/api/chat/deletemessage/${id}`, {
        headers: {
          Authorization: `Bearer ${storageData.token}`,
        },
      });

      if (res.data.success) {
        setMessageData((prev) => prev.filter((message) => message._id != id))
        // getMessage(user._id)
      }

    } catch (error) {
      console.error("Error sending message:", error);

    }
  }

  return (
    <div className="container border-start border-end border-secondary rounded-1 ">
      <div  className="row vh-100 rounded-1">
        <UserList {...{ data, handleUser }} />
        <div  className="col-12 col-sm-8 p-3">
          <div className="d-flex justify-content-between align-items-center border-secondary rounded border-bottom pb-2 mb-3" style={{ height: '55px' }}>
            <div className="d-flex align-items-center">
              <img
                src={user ? `http://localhost:8080/api/chat/uploads/${user.image}` : chatImg}
                alt="user"
                className="rounded-circle me-2"
                width={50}
                height={50}
              />

              <div>
                <div className="fw-bold">{user?.firstname || "Select a user"}</div>
                <div className=" small">{user?._id ? "online" : "offline"}</div>
              </div>
            </div>
            <div className="d-flex gap-2">
              <CiVideoOn size={25} />
              <MdAddCall size={25} />
            </div>
          </div>

          

          <Chat {...{ messageData, chatAreaRef, formatMessageTime, storageData, previewUrl, handleDelete }} />
          <div style={{ height: "40px", width: "40px", borderRadius: "50%", backgroundColor: "#e7e2e2ff" }} className="d-flex  align-items-end justify-content-end shadow-sm">
            <div>
              <AudioRecorder
                onRecordingComplete={(blob) => handleSendMessage(blob)}
                audioTrackConstraints={{ noiseSuppression: true, echoCancellation: true }}
                downloadOnSavePress={false}
                showVisualizer={false}
              />
            </div>
          </div>

          <div className="mt-1 d-flex align-items-center p-2" style={{ backgroundColor: "#f0f2f5", borderRadius: "30px", boxShadow: "0 1px 3px rgba(5, 4, 4, 0.1)", gap: "10px" }}>
            <div className="flex-grow-1 position-relative">
              <input
                onChange={(e) => setFormdata((prev) => ({ ...prev, text: e.target.value }))}
                value={formdata.text}
                type="text"
                className="form-control text-dark border-0 shadow-none px-3 py-2 pe-5"
                placeholder="Type a message"
                style={{ borderRadius: "20px", backgroundColor: "#ffffff" }}
              />
              {(formdata.text || image) && (
                <button
                  type="button"
                  onClick={handelCancel}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '16px',

                    cursor: 'pointer'
                  }}
                >
                  ❌
                </button>
              )}
            </div>




            <div style={{ height: "40px", width: "40px", cursor: "pointer", borderRadius: "50%" }} className="d-flex align-items-center justify-content-center shadow-sm">
              <label htmlFor="imge" className="m-0">
                <CiImageOn size={20} />
              </label>
              <input id="imge" name="imge" className="d-none" type="file" accept="image/*" onChange={(e) => handleImageChange(e)} />
            </div>

            <button
              onClick={() => handleSendMessage()}
              disabled={!user._id}
              className="btn d-flex align-items-center text-dark justify-content-center "
            >
              <IoSend className='text-success' size={22}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
