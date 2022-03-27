import axios from 'axios';
import React from 'react';
import style from './ChatDisplay.module.css';
import MessageBox from './MessageBox';
const ChatDisplay = ({content}) =>{
    const {senderChat,receiverChat,receiver} = content;
    const user = JSON.parse(localStorage.getItem("User"));
    const date = new Date();

    const formatData = ()=>{
        return {
            photoUrl:receiver.photoUrl?receiver.photoUrl:"/Images/avatardefault.png",
            name:receiver.FullName,
            role:receiver.role,
            messages:senderChat.chats
        }
    }

    const current = formatData();
    let [text,setText] = React.useState("");

    const handleSend = async()=>{
        const message = {
            owner:user.id,
            message:{
                messageId:user.id+date.toLocaleString(),
                messageContent:text,
                type:"text",
                timeline:date.toLocaleString()
            }
        }

        senderChat.chats = [...senderChat.chats,message];
        receiverChat.chats = [...receiverChat.chats,message];
        current.messages = [...current.messages,message];

        console.log(senderChat);

        let res = await axios.patch("http://localhost:5000/PrivateChat/"+senderChat.senderId+senderChat.receiverId,senderChat);
        console.log(res.data.msg);
        res = await axios.patch("http://localhost:5000/PrivateChat/"+receiverChat.senderId+receiverChat.receiverId,receiverChat);
        console.log(res.data.msg);
    }
    
    // const current = {
    //     photoUrl:"/Images/avatardefault.png",
    //     name:"Sandy",
    //     role:"Student",
    //     messages:[{
    //         owner:{
    //             name:"Sandy",
    //         },
    //         message:{
    //             messageId:"1",
    //             timeline:"9:30 pm",
    //             messageContent:{
    //                 text:"hello hello hello hello hello hello hello hello"
    //             }
    //         }
    //     }
    //  ]
    // }
    return (
    <div className={style.chatDisplay}>
        <div className={style.header}>
            <div className={style.profile}>
                <img className={style.profilepic} src={current.photoUrl} alt="profile pic"/>
                <div>
                    <h1 className={style.name}>{current.name}</h1>
                    <div className={style.role}>
                        <div className={style.roleIndicator}></div>
                        <h2 className={style.role}> {current.role} </h2>
                    </div>
                </div>
            </div>
            <img className={style.menu} src="/Images/menu icon.png" alt="menu" />
        </div> 
        <div className={style.mda}>
            {current.messages.map((m)=><MessageBox message={m}/>)}
        </div>  
        <div className={style.typingArea}>
            <span className={style.imageBack}><img className={style.image} src="/Images/image.png" alt="image"/></span>
            <input className={style.input} type="text" id="text" name="text" placeholder='Type Here...'  onChange={(e)=>{setText(e.target.value)}}/>
            <span className={style.sendBack}><img className={style.send} src="/Images/send icon.png" alt="send icon" onClick={()=>handleSend()}/></span>
        </div> 
    </div>);
}

export default ChatDisplay;