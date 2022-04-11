import React,{useState,useEffect} from 'react';
import style from './UserProfile.module.css';
import Bookmark from './Bookmark';
import ProfileEdit from '../Forms/ProfileEdit';
import AddSkill from '../Forms/AddSkill';
import axios from 'axios';
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
    let [click,setClick] = useState(false);
    let [addSkill,setAddSkill] = useState(false);
    let [reload,setReload] = useState(false);
    const user = JSON.parse(localStorage.getItem("User"));
    console.log(user);

    const remove = async(skill)=>{
        content.skillset = content.skillset.filter((s)=>{return s!=skill});
        try{
            console.log(content);
            const res = await axios.patch("http://localhost:5000/UserDetails/"+content.id,content);
            console.log(res);
            if(res.data.msg == "data updated"){
                localStorage.setItem("User",JSON.stringify(content));
                setReload(!reload);
            }
        }
        catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{},[reload]);
    return(
    <div className={style.outerContainer}>
       {content.role == "Student" && <div><div className={style.header}>
            <img className={style.profilePic} src={content.photoUrl?content.photoUrl:"/Images/avatardefault.png"} alt="profile pic"/>
            <h1 className={style.name}>{content.FullName}</h1>
            <h2 className={style.prn}>{"PRN Number : "+content.prn}</h2>
        </div>
        <div className={style.basicInfo}>
            <span className={style.label}>Email : </span><span className={style.value}>{content.email}</span>
            <span className={style.label}>Year : </span><span className={style.value}>{content.year}</span>
            <span className={style.label}>Branch : </span><span className={style.value}>{content.branch}</span>
        </div></div>}

        {content.role == "Teacher" && <div><div className={style.header}>
            <img className={style.profilePic} src={content.photoUrl?content.photoUrl:"/Images/avatardefault.png"} alt="profile pic"/>
            <h1 className={style.name}>{content.FullName}</h1>
            <h2 className={style.prn}>{"Employee Code : "+content.empCode}</h2>
        </div>
        <div className={style.basicInfo}>
            <span className={style.label}>Email : </span><span className={style.value}>{content.email}</span>
            <span className={style.label}>Qualification : </span><span className={style.value}>{content.qualification}</span>
        </div></div>}

        {content.role == "Alumini" && <div><div className={style.header}>
            <img className={style.profilePic} src={content.photoUrl?content.photoUrl:"/Images/avatardefault.png"} alt="profile pic"/>
            <h1 className={style.name}>{content.FullName}</h1>
            <h2 className={style.prn}>{"PRN Number : "+content.prn}</h2>
        </div>
        <div className={style.basicInfo}>
            <span className={style.label}>Job Role : </span><span className={style.value}>{content.jobRole}</span>
            <span className={style.label}>Passout Year : </span><span className={style.value}>{content.passout_year}</span>
            <span className={style.label}>Organisation : </span><span className={style.value}>{content.org}</span>
        </div></div>}

        {addSkill && <AddSkill popupstate={setAddSkill} reload={()=>setReload(!reload)}/>}
        <div className={style.skillSet}>
            <div className={style.skillHeader}>
                <span className={style.skillLabel}>Skills : </span>
                {content.id == user.id && <span className={style.add} onClick={()=>setAddSkill(true)}> Add</span>}
            </div>
            <div className={style.skillContainer}>
               { content.skillset.map((skill)=><div className={style.skill}>{skill} {content.id == user.id && <span onClick={()=>remove(skill)}>x</span>}</div>)}
            </div>
        </div>
        <div className={style.bookmark}>
            <span className={style.skillLabel}>Bookmarked Documents</span>
            <div className={style.skillContainer}>
              {content.myDoc.map((doc)=>(
                  <Bookmark id={doc} content={content} reload={()=>setReload(!reload)}/>
              ))}
            </div>
        </div>
        {content.id == user.id && <div className={style.buttonContainer}><button className={style.update} onClick={()=>setClick(true)}>Update</button></div>}
        {click && <ProfileEdit popupstate={setClick}/>}
    </div>
    );
}

export default UserProfile;