import React from 'react';
import style from './GroupMessageBox.module.css';
import Poll from '../poll/poll';
import ViewImage from '../Chat/ViewImage';

const GroupMessageBox = (props) =>{
    const user = JSON.parse(localStorage.getItem("User"));
    const [click,setClick] = React.useState(false);
    const m = props.message;
    return(
    <div className={m.senderId==user.id?style.ownerBox:style.friendBox}>
        <div className={style.header}>
            {m.senderId!=user.id?<h1 className={style.name}>{m.senderName}</h1>:<h1 className={style.name}>You</h1>}
            {m.senderId==user.id&&<img className={style.menu} src="/Images/deleteBlack.png" alt="menu icon" onClick={()=>props.delete(m.messageId)}/>}
        </div>
        {click && <ViewImage popupstate={setClick} imagesrc={m.content}/>}
        {m.type == "text"&&<p className={m.senderId==user.id?style.content:style.contentRight}>{m.content}</p>}
        {m.type == "image"&&<img src={m.content} alt="shared image" className={style.sharedImg} onClick={()=>setClick(true)}/>}
        {m.type == "poll" &&<Poll id={m.content} groupDetails={props.groupDetails}/>}
        <h2 className={style.time}>{m.timeline.split(",")[1]}</h2>
    </div>
    )
}

export default GroupMessageBox;