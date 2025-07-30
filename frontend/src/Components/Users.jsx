import React, { useEffect, useState } from 'react';
import chatImg from '../assets/chat.jpg';
import { MdAddCall } from "react-icons/md";
import { CiVideoOn } from "react-icons/ci";
import axios from 'axios';
import { format, isToday, isYesterday } from 'date-fns';

const Users = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});
  const [storageData, setStorageData] = useState(null)
  const [messageData, setMessageData] = useState([])
  const [formdata, setFotmdata] = useState({
    recieverId: '',
    text: ''
  })
  const [currentUserId, setCurrentUserId] = useState(null)


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







  //  get all messages
  const getMessage = async (id) => {
    try {

      const chatRes = await axios.get(`http://localhost:8080/api/chat/getmessage/${id}`, {
        headers: {
          Authorization: `Bearer ${storageData.token}`,
        },
      });
      if (chatRes.data.success) {
        setMessageData(chatRes.data.allMessage)
      }

      console.log("Chat response:", chatRes.data);


    } catch (error) {
      console.error("Error starting chat:", error);
    }
  }






  // get user which one with chat
  const handleUser = async (id) => {
    setCurrentUserId(id)
    try {
      const res = await axios.get(`http://localhost:8080/api/auth/user/${id}`);

      if (res.data.success) {
        getMessage(id)
        setUser(res.data.user);
        setFotmdata((prev) => ({ ...prev, recieverId: res.data.user._id }))
      }

    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };



  // handleFrom data

  const handleForm = async () => {
    try {

      const res = await axios.post(`http://localhost:8080/api/chat/sendmessage`, formdata, {
        headers: {
          Authorization: `Bearer ${storageData.token}`,
        },
      });

      if (res.data.success) {
        console.log(res.data)
        setFotmdata((prev) => ({ ...prev, text: '' }))
        getMessage(currentUserId)
      }

    } catch (error) {
      console.error("Error sending message:", error);

    }
  }


  // in actual time


  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'hh:mm a'); // like "10:32 AM"
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'hh:mm a')}`;
    } else {
      return format(date, 'dd MMM, hh:mm a'); // like "28 Jul, 9:30 PM"
    }
  };

  return (
    <div className="container">
      <div className="row vh-100">
        {/* Sidebar */}
        <div className="col-12 col-sm-4 border-end p-3 bg-light">
          <div className="border-bottom mb-3" style={{ height: '55px' }}>
            <h4 className="text-center">Users List</h4>
          </div>

          {data.map((userItem) => (
            <div
              key={userItem._id}
              onClick={() => handleUser(userItem._id)}
              className="d-flex align-items-center p-2 rounded hover-shadow mb-2 border-bottom"
              style={{ cursor: 'pointer' }}
            >
              <img src={chatImg} alt="avatar" className="rounded-circle me-2" width={50} height={50} />
              <div>
                <div className="fw-bold">{userItem.firstname}</div>
                <div className="text-success small">{userItem.email}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Chat Area */}
        <div style={{backgroundColor:'pink'}} className="col-12 col-sm-8 p-3">
          <div
            style={{ height: '55px' }}
            className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3"
          >
            <div className="d-flex align-items-center">
              <img src={chatImg} alt="avatar" className="rounded-circle me-2" width={50} height={50} />
              <div>
                <div className="fw-bold">{user?.firstname || "Select a user"}</div>
                <div className="text-muted small">online</div>
              </div>
            </div>
            <div className="d-flex gap-2">
              <CiVideoOn size={25} />
              <MdAddCall size={25} />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="chat-area d-flex flex-column gap-2" style={{ height: '70vh', overflowY: 'auto' }}>
            {messageData.length === 0 && (
              <p className="text-muted text-center mt-5">Start chatting...</p>
            )}
            {
              messageData.map((message) => {
                const isSender = message.senderId._id === storageData?.id;
                const formattedTime = formatMessageTime(message.createdAt);

                return (
                  <div key={message._id} className={`d-flex flex-column ${!isSender ? 'align-items-start' : 'align-items-end'}`}>
                    <div className={`card p-2 ${!isSender ? 'bg-primary-subtle text-dark' : 'bg-success-subtle text-dark'}`} style={{ maxWidth: '70%' }}>
                      {message.text}
                    </div>
                    <small className="text-muted mt-1">{formattedTime}</small>
                  </div>
                );
              })
            }
          </div>



          {/* Message Input */}
          <div className="mt-3 d-flex align-items-center">
            <input onChange={(e) => setFotmdata((prev) => ({ ...prev, text: e.target.value }))} value={formdata.text} type="text" className="form-control me-2" placeholder="Type a message" />
            <button onClick={handleForm} disabled={!user._id || !formdata.text} className="btn btn-success">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
