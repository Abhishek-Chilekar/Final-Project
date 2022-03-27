import React from 'react';
import style from '../Chat/ChatDisplay.module.css';
import GroupMessageBox from './GroupMessageBox';

const GroupChatDisplay = (props)=>{
    const current = {
        photoUrl:"/Images/avatardefault.png",
        groupId:"1",
        groupName:"BE DIV 2",
        groupDescription:"",
        member:[],
        poll:[],
        requests:[],
        chat:[
            {
                messageId:"1",
                senderName:"me",
                content:"how are youww",
                timeline:"9:00pm"
            },
            {
                messageId:"2",
                senderName:"Hari",
                content:"how are you",
                timeline:"9:10pm"
            },
        ]
    }
/*
{
    groupId:
    groupName:
    groupDescription:
    member:[{senderId,role,isAdmin}]
    chat:[{messageId,senderName,content,timeline}]
    poll:[{pollId,senderName,options:[{name,percentage}]}]
    requests:[userid]
}
*/
    return(
        <div className={style.groupChatDisplay}>
            <div className={style.header}>
                <div className={style.profile}>
                    <img className={style.profilepic} src={current.photoUrl} alt="profile pic"/>
                    <h1 className={style.name}>{current.groupName}</h1>
                </div>
                <img className={style.menu} src="/Images/menu icon.png" alt="menu" />
            </div> 
            <div className={style.mda}>
                {current.chat.map((m)=><GroupMessageBox message={m}/>)}
            </div>  
            <div className={style.typingArea}>
                <span className={style.imageBack}><img className={style.image} src="/Images/image.png" alt="image"/></span>
                <input className={style.input} type="text" id="text" name="text" placeholder='Type Here...'/>
                <span className={style.sendBack}><img className={style.send} src="/Images/send icon.png" alt="send icon"/></span>
            </div>
        </div>
    );
}

export default GroupChatDisplay;