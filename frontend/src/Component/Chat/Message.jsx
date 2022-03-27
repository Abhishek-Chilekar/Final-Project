import React from 'react';
import style from './Message.module.css';

const Message = (props) =>{
    let content = props.content;
    content.text = content.text.length > 200 ? content.text.slice(0,200)+'...': content.text
    return (
        <div className={style.messageBox}>
            <div className={style.header}>
                <div className={style.senderProfile}>
                    <img  className={style.profilePic} src={content.photoUrl} alt="profile pic"/>
                    <div>
                        <h1 className={style.name}>{content.name}</h1>
                        <div className={style.roleIndicator}>
                            <div className={style.indicator}></div>
                            <h2 className={style.role}>{content.role}</h2>
                        </div>
                    </div>
                </div>
                <div className={style.extraInfo}>
                    <h1 className={style.timeline}>{content.timeline}</h1>
                    <div className={style.count}>{content.count}</div>
                </div>
            </div>
            <p className={style.body}>{content.text}</p>
        </div>
    );
    // return(<h1>abhi</h1>)
}

export default Message;