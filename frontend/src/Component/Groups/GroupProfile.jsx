import axios from 'axios';
import React from 'react';
import style from './GroupProfile.module.css';
import Member from './Member';
import Requests from './Requests';

/*
{
    groupId:
    photoUrl:
    groupName:
    groupDescription:
    member:[{senderId,role,isAdmin}]
    chat:[{messageId,senderName,content,timeline}]
    poll:[{pollId,senderName,options:[{name,percentage}]}]
    requests:[userid]
}
*/
const GroupProfile = ({content}) =>{

    const [reload,setReload] = React.useState(false);

    const accept = async(user,role)=>{
        content.member = [...content.member,{
            senderId:user.id,
            role:role,
            isAdmin:"false"
        }];

        content.requests = content.requests.filter((i)=>{return i!=user.id});

        try{
            let res = await axios.patch("http://localhost:5000/GroupChat/"+content.id,content);
            console.log(res);
            if(res.data.msg = "Group Details Updated"){
                user.groupId = [...user.groupId,content.id]
                res = await axios.patch("http://localhost:5000/UserDetails/"+user.id,user);
                console.log(res);
                if(res.data.msg == "data updated"){
                    const notification = {
                        heading : "Request Accepted",
                        content : "Admin of the "+content.groupName+" accepted your request to join the group.",
                        contentId:content.id,
                        url:content.id,
                        type:user.id,
                        image:'./Images/accepted.png',
                        branch:user.branch,
                        purpose:"group"
                    }

                    res = await axios.post("http://localhost:5000/Notification/",notification);
                    console.log(res);
                }
            }
        }
        catch(e){
            console.log(e);
        }
        setReload(!reload);
    }

    const decline = async(id,branch)=>{
        content.requests = content.requests.filter((i)=>{return i!=id});

        try{
            let res = await axios.patch("http://localhost:5000/GroupChat/"+content.id,content);
            console.log(res);
            if(res.data.msg == "Group Details Updated"){
                const notification = {
                    heading : "Request Denied",
                    content : "Admin of the "+content.groupName+" denied your request to join the group.",
                    contentId:content.id,
                    url:content.id,
                    type:id,
                    image:'./Images/denied.png',
                    branch:branch,
                    purpose:"group"
                }

                res = await axios.post("http://localhost:5000/Notification/",notification);
                console.log(res);
            }
        }
        catch(e){
            console.log(e);
        }
        setReload(!reload);
    }

    React.useEffect(()=>{},[reload]);
    return(
    <div className={style.outerContainer}>
        <div className = {style.header}>
            <img className={style.profilePic} src={content.photoUrl} alt="group icon"/>
            <h1 className={style.name}>{content.groupName}</h1>
        </div>
        <div className={style.basicInfo}>
            <span className={style.label}>Description:</span>
            <span className={style.value}>{content.groupDescription}</span>
        </div>
        <div className={style.memberList}>
            <span className={style.title}>Members: </span>
            <div className={style.listContainer}>
                {content.member.map((details)=>(
                   <Member details={details}/>
                ))}
            </div>
        </div>
        <div className={style.memberList}>
            <span className={style.title}>Requests: </span>
            <div className={style.listContainer}>
                {content.requests.map((id)=>(
                    <Requests id={id} accept={accept} decline={decline}/>
                ))}
            </div>
        </div>
    </div>
    );
}

export default GroupProfile;