import React from 'react'
import chatImg from '../assets/chat.jpg';

const UserList = ({data,handleUser}) => {
  return (
    <div className="col-12 col-sm-4 border-end p-3 bg-light">
              <div className="border-bottom mb-3" style={{ height: '55px' }}>
                <h4 className="text-center fw-bold">Users List</h4>
              </div>
    
              {data.map((userItem) => (
                <div
                  key={userItem._id}
                  onClick={() => handleUser(userItem._id)}
                  className="d-flex align-items-center p-2 rounded hover-shadow mb-2 border-bottom"
                  style={{ cursor: 'pointer' }}
                >
                  <img src={`http://localhost:8080/api/chat/uploads/${userItem.image}`} alt="avatar" className="rounded-circle me-2" width={50} height={50} />
                  <div>
                    <div className="fw-bold">{userItem.firstname}</div>
                    <div className="text-success small">{userItem.email}</div>
                  </div>
                </div>
              ))}
            </div>
  )
}

export default UserList
