import React from 'react';
import m_style from '../Chat/Message.module.css';
import style from './GroupMessage.module.css';

const GroupMessage = (props) =>{
    const content = props.content;
    const messages = content.messages;
    const length = messages.length;
    messages[length-1].content = messages[length-1].content.length > 100 ? messages[length-1].content.slice(0,100)+'...': messages[length-1].content;
    
    return (
        <div className={m_style.messageBox}>
            <div className={m_style.header}>
               <div className={m_style.senderProfile}>
                    <img className={style.profilePic} src={content.photoUrl} alt="group icon"/>
                    <div>
                        <h1 className={style.name}>{content.groupName}</h1>
                    </div>
               </div>
               <div className={style.extraInfo}>
                    <h1 className={m_style.timeline}>{messages[length-1].timeline}</h1>
                    <div className={m_style.count}>{length}</div>
               </div>
            </div>
            <p className={style.body}><span className={style.senderName}>{messages[length-1].senderName} : </span><span>{messages[length-1].content}</span></p>
        </div>
    )
}

export default GroupMessage;

