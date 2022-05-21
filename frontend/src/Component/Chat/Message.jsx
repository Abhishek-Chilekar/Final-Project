import React from 'react';
import style from './Message.module.css';
import { useSelector,useDispatch } from 'react-redux';
import { chats } from '../../Actions/thirdScreenAction';
import { updateWindow } from '../../Actions/windowAction';
import axios from 'axios';

const Message = (props) =>{
    const [content,setContent] = React.useState({});
    const [clickFlag,setClickFlag] = React.useState(false);
    const {width} = useSelector(state => state.UpdateWindow);
    const getContent=async()=>{
        const ruser = await axios.get("http://localhost:5000/UserDetails/"+props.chat.receiverId);
        const user = ruser.data[0];
        let receiverChat = await axios.get("http://localhost:5000/PrivateChat/"+props.chat.receiverId+props.chat.senderId);
        setContent({
            id:props.chat.id,
            photoUrl:user.photoUrl?user.photoUrl:"/Images/avatardefault.png",
            name:user.FullName,
            role:user.role,
            timeline:props.chat.chats.length!=0?props.chat.chats[props.chat.chats.length-1].message.timeline:"",
            type:props.chat.chats.length!=0?props.chat.chats[props.chat.chats.length-1].message.type:"",
            text:props.chat.chats.length!=0&&props.chat.chats[props.chat.chats.length-1].message.type == "text"?props.chat.chats[props.chat.chats.length-1].message.messageContent:"",
            allDetails:{
                senderChat:props.chat,
                receiver:user,
                receiverChat:receiverChat.data,
                reloadList:props.setReload
            }
        })
        content.text = content.text ?(content.text.length > 200 ? content.text.slice(0,200)+'...': content.text):"";
    }

    React.useEffect(()=>{getContent()},[]);
    React.useEffect(()=>getContent(),[props.reload]);
    
    const dispatch = useDispatch();
    return (
        <div className={style.messageBox} onClick={()=>{
            dispatch(chats(content.allDetails));
            setClickFlag(true);
            if(width < 1040){
                dispatch(updateWindow(true));
            }
        }}>
            {/* <img src="/Images/deleteBlack.png" alt="delete" className={style.deleteIcon}/> */}
            <div className={style.header}>
                <div className={style.senderProfile}>
                    <img  className={style.profilePic} src={content.photoUrl} alt="profile pic"/>
                    <div className={style.details}>
                        <h1 className={style.name}>{content.name}</h1>
                        <div className={style.roleIndicator}>
                            <div className={content.role == "Student"?style.studentIndicator:content.role == "Teacher"?style.teacherIndicator:style.aluminiIndicator}></div>
                            <h2 className={style.role}>{content.role}</h2>
                        </div>
                    </div>
                </div>
                <div className={style.extraInfo}>
                    <h1 className={style.timeline}>{content.timeline && content.timeline.split(',')[1]}</h1>
                    {/* <div className={style.count}>{content.count}</div> */}
                </div>
            </div>
            {content.type!=""&&content.type == "text"?<p className={style.body}>{content.text}</p>:content.type!=""&&<div className={style.imgIndicator}><img src="/Images/photo.png" alt="photo"/><p>Photo</p></div>}
        </div>
    );
    // return(<h1>abhi</h1>)
}

export default Message;