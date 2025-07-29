import React, { useEffect, useState } from 'react';
import chatImg from '../assets/chat.jpg';
import { MdAddCall } from "react-icons/md";
import { CiVideoOn } from "react-icons/ci";
import axios from 'axios';

const Users = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/auth/allusers');
        setData(res.data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchData();
  }, []);

  const handleChat = async (id) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user')); // ✅ Proper parsing
      if (!userData?.token) return console.error("No token found!");

      const chatRes = await axios.get(`http://localhost:8080/api/chat/getmessage`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });

      console.log("Chat response:", chatRes.data);

      const res = await axios.get(`http://localhost:8080/api/auth/user/${id}`);
      setUser(res.data.user);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row vh-100">
        {/* Sidebar */}
        <div className="col-12 col-sm-4 border-end p-3 bg-light">
          <div className="border-bottom mb-3" style={{ height: '55px' }}>
            <h4 className="text-center">Users List</h4>
          </div>

          {data.map((userItem) => (
            <div
              key={userItem._id}
              onClick={() => handleChat(userItem._id)}
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
        <div className="col-12 col-sm-8 p-3">
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
          <div className="chat-area" style={{ height: '70vh', overflowY: 'auto' }}>
            <p className="text-muted text-center mt-5">Start chatting...</p>
          </div>

          {/* Message Input */}
          <div className="mt-3 d-flex align-items-center">
            <input type="text" className="form-control me-2" placeholder="Type a message" />
            <button className="btn btn-success">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
