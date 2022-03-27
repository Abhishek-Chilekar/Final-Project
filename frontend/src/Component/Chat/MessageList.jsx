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

const MessageList = () =>{
    const currentUser = JSON.parse(localStorage.getItem("User"));
    const requests = currentUser.request;

    const contentList = {
            private_chat:[],
            group_chat:[],
            request:requests
    }

    return(
    <div className={style.messageList}>
        {contentList.private_chat.map((m)=><Message content={m}/>)}
        {contentList.group_chat.map((m)=><GroupMessage content={m}/>)}
        {contentList.request.map((m)=><Request content={m}/>)}
    </div>
    )
    // return <Message />

}

export default MessageList;