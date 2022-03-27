import React from 'react';
import style from './GroupMessageBox.module.css';

const GroupMessageBox = (props) =>{
    const m = props.message;
    return(
    <div className={m.senderName=="me"?style.ownerBox:style.friendBox}>
        {m.senderName!="me"?<h1 className={style.name}>{m.senderName}</h1>:<h1 className={style.name}>You</h1>}
        <p className={style.content}>{m.content}</p>
        <h2 className={style.time}>{m.timeline}</h2>
    </div>
    )
}

export default GroupMessageBox;