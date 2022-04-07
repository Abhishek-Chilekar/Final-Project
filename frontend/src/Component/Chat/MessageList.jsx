// private_chat:[
            //     {
            //         photoUrl : '/Images/avatardefault.png',
            //         role:"Student",
            //         name:"sandy",
            //         timeline:"1 minute ago",
            //         count:"2",
            //         text:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. "
            //     },
            // ],

            // group_chat:[
            //     {
            //         photoUrl : '/Images/avatardefault.png',
            //         groupName: "BE Div 2 ",
            //         messages:[
            //             {
            //                 messageId: "1",
            //                 senderName:"abhi",
            //                 content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown .............",
            //                 timeline : "1 minute ago",
            //             }
            //         ]
            //     }
            // ],

import React from 'react';
import style from './MessageList.module.css';
import Message from './Message';
import GroupMessage from '../Groups/GroupMessage';
import Request from './RequestMessage';
import axios from 'axios';

const MessageList = ({select}) =>{
    const currentUser = JSON.parse(localStorage.getItem("User"));
    const requests = currentUser.request;
    const [gchat,setGchat] = React.useState([]);
    const [pchat,setPchat] = React.useState([]);
    const getPrivateChats = async()=>{
        setPchat([]);
        let {data} = await axios.get("http://localhost:5000/PrivateChat");
        data = data.filter((d)=>{return d.senderId == currentUser.id});
        data.map(async(chat)=>{
            const ruser = await axios.get("http://localhost:5000/UserDetails/"+chat.receiverId);
            const user = ruser.data[0];
            let receiverChat = await axios.get("http://localhost:5000/PrivateChat/"+chat.receiverId+chat.senderId);
            setPchat([...pchat,{
                id:chat.id,
                photoUrl:user.photoUrl?user.photoUrl:"/Images/avatardefault.png",
                name:user.FullName,
                role:user.role,
                timeline:chat.chats[chat.chats.length-1].message.timeline,
                type:chat.chats[chat.chats.length-1].message.type,
                text:chat.chats[chat.chats.length-1].message.type == "text"?chat.chats[chat.chats.length-1].message.messageContent:"",
                allDetails:{
                    senderChat:chat,
                    receiver:user,
                    receiverChat:receiverChat.data
                }
            }])
        });
    }

    const getGroupChats =()=>{
        setGchat([]);
        const user = JSON.parse(localStorage.getItem("User"));
        user.groupId.map(async(id)=>{
            const res = await axios.get("http://localhost:5000/GroupChat/"+id);
            console.log(res)
            setGchat([...gchat,res.data[0]]);
        });
    }

    React.useEffect(()=>{getPrivateChats();getGroupChats();},[])
    console.log(gchat);
    const contentList = {
            private_chat:pchat,
            group_chat:gchat,
            request:requests
    }

    return(
    <div className={style.messageList}>
        {(select=="All"||select=="private_chat")&&contentList.private_chat.map((m)=><Message content={m}/>)}
        {(select=="All"||select=="group_chat")&&contentList.group_chat.map((m)=><GroupMessage content={m}/>)}
        {(select=="All"||select=="requests")&&contentList.request.map((m)=><Request content={m}/>)}
    </div>
    )
    // return <Message />

}

export default MessageList;