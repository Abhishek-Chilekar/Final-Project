import React from 'react';
import style from './GroupProfile.module.css';

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
const GroupProfile = () =>{

    const content = {
        groupId:"1",
        photoUrl:"/Images/avatardefault.png",
        groupName:"BE DIV 2",
        groupDescription:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
        member:[{
            name:"Abhishek Chilekar",
            photoUrl:"/Images/avatardefault.png",
            role:"student",
            isAdmin:true
        },{
            name:"Nikhil Mahajan",
            photoUrl:"/Images/avatardefault.png",
            role:"student",
            isAdmin:false
        },{
            name:"Akshay Gidwani",
            photoUrl:"/Images/avatardefault.png",
            role:"student",
            isAdmin:false
        }],
        request:[{
            name:"Swarup Phatangare",
            photoUrl:"/Images/avatardefault.png",
        }]
    }
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
                {content.member.map((m)=>(
                    <div className={style.member}>
                        <div className={style.details}>
                            <img className={style.image} src={m.photoUrl} alt="Profile pic"/>
                            <h1 className={style.memberName}>{m.name}</h1>
                        </div>
                        <span className={m.isAdmin?style.role:style.studentRole}>{m.isAdmin?"Admin":m.role}</span>
                    </div>
                ))}
            </div>
        </div>
        <div className={style.memberList}>
            <span className={style.title}>Requests: </span>
            <div className={style.listContainer}>
                {content.request.map((m)=>(
                    <div className={style.member}>
                        <div className={style.details}>
                            <img className={style.image} src={m.photoUrl} alt="Profile pic"/>
                            <h1 className={style.memberName}>{m.name}</h1>
                        </div>
                        <div className={style.buttons}>
                            <img className={style.accept} src="/Images/accept.png" alt="plus"/>
                            <h1 className={style.decline}>x</h1>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
}

export default GroupProfile;