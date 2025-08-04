import React from 'react'
import { MdDeleteForever } from "react-icons/md";
import { fullUrl } from '../services/api';

const Chat = ({ messageData, formatMessageTime, chatAreaRef, storageData, previewUrl ,handleDelete }) => {
  // console.log(messageData)
  // console.log(storageData)
  return (
    <div ref={chatAreaRef} className="chat-area  no-scrollbar d-flex flex-column gap-2" style={{ height: '70vh', overflowY: 'auto' }}>
      {messageData.length === 0 && (
        <p className=" text-center mt-5">Start chatting...</p>
      )}
      {
        messageData.map((message) => {
          const isSender = message.senderId._id === storageData?.id;
          const formattedTime = formatMessageTime(message.createdAt);

          return (
            <div key={message._id} className={`d-flex flex-column ${!isSender ? 'align-items-start' : 'align-items-end'}`}>
              {message.text && (<div className={`card p-2 ${!isSender ? 'bg-primary-subtl text-dar' : 'bg-success-subtl text-dar'}`} style={{ maxWidth: '70%' }}>
                {message.text}
              </div>)}
              {message.image && (<img src={`${fullUrl}/${message.image}`} style={{ maxWidth: '30%' }} />

              )}
              {message.audio && (
                <div style={{ maxWidth: '70%' }}>
                  <audio controls src={`${fullUrl}/${message.audio}`} />
                </div>
              )}

             <div> 
              <small className="text-mute mt-1">{formattedTime}</small>  

             {storageData.id==message.senderId._id&&( <small onClick={()=>handleDelete(message._id)} className="text-danger">< MdDeleteForever size={15}/></small>)}
              
               </div> 
            </div>
          );
        })
      }
      <div className='d-flex align-items-center justify-content-center'>{previewUrl && (<img width={150} src={previewUrl} alt="previewImage" />)}</div>
    </div>
  )
}

export default Chat
