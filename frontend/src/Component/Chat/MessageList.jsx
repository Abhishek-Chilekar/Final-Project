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

const MessageList = ({select,reload,setReload}) =>{
    const currentUser = JSON.parse(localStorage.getItem("User"));
    const requests = currentUser.request;
    const [pdata,setPdata] = React.useState([]);
    const [user,setUser] = React.useState({groupId:[],request:[]});
    const getPrivateChats = async()=>{
        setPdata([]);
        let {data} = await axios.get("http://localhost:5000/PrivateChat");
        setPdata(data.filter((d)=>{return d.senderId == currentUser.id}));
        const res = await axios.get("http://localhost:5000/UserDetails/"+currentUser.id);
        setUser(res.data[0]);
    }

    React.useEffect(()=>{getPrivateChats();},[])
    React.useEffect(()=>{getPrivateChats();},[reload])

    return(
    <div className={style.messageList}>
        {(select=="All"||select=="private_chat")&&pdata.map((m)=><Message chat={m} reload={[reload,setReload]}/>)}
        {(select=="All"||select=="group_chat")&&user.groupId.map((id)=><GroupMessage id={id} reload={[reload,setReload]}/>)}
        {(select=="All"||select=="requests")&&user.request.map((m)=><Request content={m} reload={setReload}/>)}
    </div>
    )
}

export default MessageList;