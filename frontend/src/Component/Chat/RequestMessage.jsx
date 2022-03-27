import axios from 'axios';
import React from 'react';
import style from './RequestMessage.module.css';

// {
//     requestId:"1",
//     senderName:"Anita",
//     skills:["WEB-DEV","Content Writing","Designing"],
//     requestMessage:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
// }
const RequestMessage = (props) =>{
    const [content,setContent] = React.useState({});
    const currentUser = JSON.parse(localStorage.getItem("User"));
    const formatData = async(data)=>{
        const res = await axios.get("http://localhost:5000/UserDetails/"+data.senderId);
        const user = res.data[0];
        setContent({
            requestId:data.requestId,
            requestMessage:data.requestMessage,
            senderName:user.FullName,
            skills:user.skillset,
            photoUrl:user.photoUrl?user.photoUrl:"/Images/avatardefault.png"
        })
    }

    const handleAccept=async(data)=>{
        try{
            console.log("In the function")
            const res = await axios.get("http://localhost:5000/UserDetails/"+data.senderId);
            const user = res.data[0];
            currentUser.request = currentUser.request.filter((r)=>{return r.senderId != props.content.senderId});
            currentUser.requestAccepted = [...currentUser.requestAccepted,props.content.senderId];
            user.requestAccepted = [...user.requestAccepted,currentUser.id]
            const updateres = await axios.patch("http://localhost:5000/UserDetails/"+currentUser.id,currentUser);
            console.log(updateres.data.msg);
            if(updateres.data.msg == "data updated"){
                console.log(user);
                localStorage.setItem("User",JSON.stringify(currentUser));
                const updateres = await axios.patch("http://localhost:5000/UserDetails/"+user.id,user);
                console.log(updateres.data.msg);
            }
        }
        catch(e){
            console.log(e.message)
        }
    }

    const handleDecline=async()=>{
        try{
            currentUser.request = currentUser.request.filter((r)=>{return r.senderId != props.content.senderId});
            const res = await axios.patch("http://localhost:5000/UserDetails/"+currentUser.id,currentUser);
            console.log(res.data.msg);
            if(res.data.msg == "data updated"){
                localStorage.setItem("User",JSON.stringify(currentUser));
            }
        }
        catch(e){
            console.log(e.message)
        }
    }


    React.useEffect(()=>{
        formatData(props.content);
    },[])
    return (
        <div className={style.messageBox}>
            <img className={style.profilePic} src={content.photoUrl} alt="group icon"/>
            <div className={style.info}>
                <div className={style.container}>
                    <h1 className={style.name}>{content.senderName}</h1>
                   {content.skills&&<div className={style.skillContainer}>{content.skills.map((m)=><h1 className={style.skill}>{m}</h1>)}</div>}
                </div>
                <p className={style.message}>
                    {content.requestMessage}
                </p>  
                <span className={style.buttonContainer}>
                    <h2 className={style.accept} onClick={()=>handleAccept(props.content)}><img className={style.icon} src="/images/accept.png" alt="accept" />Accept</h2>
                    <h2 className={style.decline} onClick={()=>handleDecline()}><img className={style.icon} src="/images/decline.png" alt="decline" />Decline</h2>
                </span>
            </div>
        </div>
    )
}

export default RequestMessage;