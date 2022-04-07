import React from 'react';
import m_style from '../Chat/Message.module.css';
import style from './GroupMessage.module.css';
import { useDispatch } from 'react-redux';
import { group_chats } from '../../Actions/thirdScreenAction';

const GroupMessage = (props) =>{
    const dispatch = useDispatch();
    const content = props.content;
    console.log(props.content);
    const messages = content.chat;
    const length = messages.length;
    const m = (length == 0 ? "" :messages[length-1].content.length > 100 ? messages[length-1].content.slice(0,100)+'...': messages[length-1].content)
    
    const handleClick = ()=>{
        dispatch(group_chats(content));
    }
    return (
        <div className={m_style.messageBox} onClick={()=>handleClick()}>
            <div className={m_style.header}>
               <div className={m_style.senderProfile}>
                    <img className={length==0?style.profilePic1:style.profilePic} src={content.photoUrl} alt="group icon"/>
                    <div>
                        <h1 className={length == 0?style.name1:style.name}>{content.groupName}</h1>
                    </div>
               </div>
               {length!=0&&<div className={style.extraInfo}>
                    <h1 className={m_style.timeline}>{messages[length-1].timeline.split(',')[1]}</h1>
                    {/* <div className={m_style.count}>{length}</div> */}
               </div>}
            </div>
            {length != 0 &&(messages[length-1].type == "text"?<p className={style.body}>
                <span className={style.senderName}>{messages[length-1].senderName}</span>{":"+m}</p>
                :length != 0 &&(messages[length-1].type == "image")?<div className={style.imgIndicator}><img src="/Images/photo.png" alt="photo"/><p>Photo</p></div>
                :<div className={style.imgIndicator}><img src="/Images/poll.png" alt="photo"/><p>Poll</p></div>)}
        </div>
    )
}

export default GroupMessage;

