import React,{useState} from 'react';
import style from './UserProfile.module.css';
import Bookmark from './Bookmark';
/*
    {
        common :
        UserId:
        FullName:
        email:
        skillset:[]
        request:[{requestId,senderId,requestMessage}]
        groupId:[]
        myDoc:[]
        role:
        chatId
        -----------------
        student:
        year:       
        branch:
        prn:
        -----------------
        teacher:
        qualification:
        -----------------
        alumin:
        jobTitle:
        passout_year:
    }
*/

const UserProfile = ({content})=>{
    return(
    <div className={style.outerContainer}>
        <div className={style.header}>
            <img className={style.profilePic} src={content.photoUrl?content.photoUrl:"/Images/avatardefault.png"} alt="profile pic"/>
            <h1 className={style.name}>{content.FullName}</h1>
            <h2 className={style.prn}>{"PRN Number : "+content.prn}</h2>
        </div>
        <div className={style.basicInfo}>
            <span className={style.label}>Email : </span><span className={style.value}>{content.email}</span>
            <span className={style.label}>Year : </span><span className={style.value}>{content.year}</span>
            <span className={style.label}>Branch : </span><span className={style.value}>{content.branch}</span>
        </div>
        <div className={style.skillSet}>
            <div className={style.skillHeader}>
                <span className={style.skillLabel}>Skills : </span>
                <span className={style.add}> Add</span>
            </div>
            <div className={style.skillContainer}>
               { content.skillset.map((skill)=><div className={style.skill}>{skill} <span>x</span></div>)}
            </div>
        </div>
        <div className={style.bookmark}>
            <span className={style.skillLabel}>Bookmarked Documents</span>
            <div className={style.skillContainer}>
              {content.myDoc.map((doc)=>(
                  <Bookmark id={doc}/>
              ))}
            </div>
        </div>
    </div>
    );
}

export default UserProfile;