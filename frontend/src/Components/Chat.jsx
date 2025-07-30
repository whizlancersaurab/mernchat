import React from 'react'

const Chat = ({messageData,formatMessageTime ,chatAreaRef ,storageData}) => {
  return (
    <div ref={chatAreaRef} className="chat-area  no-scrollbar d-flex flex-column gap-2" style={{ height: '75vh', overflowY: 'auto' }}>
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
  )
}

export default Chat
