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
    const handleAccept=async(data,setDisabled,disabled)=>{
        try{
            if(!disabled){
                setDisabled(true);
                console.log("In the function")
                const res = await axios.get("http://localhost:5000/UserDetails/"+data.senderId);
                const user = res.data[0];
                currentUser.request = currentUser.request.filter((r)=>{return r.senderId != data.senderId}); 
                currentUser.requestAccepted = [...currentUser.requestAccepted,data.senderId];
                user.requestAccepted = [...user.requestAccepted,currentUser.id]
                const updateres = await axios.patch("http://localhost:5000/UserDetails/"+currentUser.id,currentUser);
                console.log(updateres.data.msg);
                if(updateres.data.msg == "data updated"){
                    console.log(user);
                    localStorage.setItem("User",JSON.stringify(currentUser));
                    const updateres = await axios.patch("http://localhost:5000/UserDetails/"+user.id,user);
                    console.log(updateres.data.msg);
                    if(updateres.data.msg == "data updated"){
                        const notification = {
                            heading : "Request Accepted",
                            content : currentUser.FullName+" accepted your request to contact him.",
                            contentId:currentUser.id,
                            url:currentUser.id,
                            type:user.id,
                            image:'./Images/accepted.png',
                            branch:user.branch,
                            purpose:"group"
                        }

                        const notiRes = await axios.post("http://localhost:5000/Notification/",notification);
                        console.log(notiRes);
                        setDisabled(false);
                        setReload();
                    }
                }
            }
        }
        catch(e){
            console.log(e.message)
        }
    }

    const handleDecline=async(data,setDisabled,disabled)=>{
        try{
            if(!disabled){
                setDisabled(true);
                let res = await axios.get("http://localhost:5000/UserDetails/"+data.senderId);
                const user = res.data[0];
                currentUser.request = currentUser.request.filter((r)=>{return r.senderId != data.senderId});
                res = await axios.patch("http://localhost:5000/UserDetails/"+currentUser.id,currentUser);
                console.log(res.data.msg);
                if(res.data.msg == "data updated"){
                    localStorage.setItem("User",JSON.stringify(currentUser));
                    const notification = {
                        heading : "Request Denied",
                        content : currentUser.FullName+" denied your request to contact him.",
                        contentId:currentUser.id,
                        url:currentUser.id,
                        type:user.id,
                        image:'./Images/denied.png',
                        branch:user.branch,
                        purpose:"group"
                    }

                    const notiRes = await axios.post("http://localhost:5000/Notification/",notification);
                    console.log(notiRes);
                    setDisabled(false);
                    setReload();
                }
            }
        }
        catch(e){
            console.log(e.message)
        }
    }


    React.useEffect(()=>{getPrivateChats();},[])
    React.useEffect(()=>{getPrivateChats();},[reload])

    return(
    <div className={style.messageList}>
        {(select=="All"||select=="private_chat")&&pdata.map((m)=><Message chat={m} reload={reload} setReload={()=>setReload()}/>)}
        {(select=="All"||select=="group_chat")&&user.groupId.map((id)=><GroupMessage id={id} reload={[reload,setReload]}/>)}
        {(select=="All"||select=="requests")&&user.request.map((m)=><Request content={m} reload={setReload} handleAccept={handleAccept} handleDecline={handleDecline}/>)}
    </div>
    )
}

export default MessageList;