import axios from "axios";
import React from "react";
import style from "./removemembers.module.css";
import Member from "../Groups/Member";
const RemoveMembers = ({popupstate,groupDetails}) => {
    const user = JSON.parse(localStorage.getItem("User"));

    const handleClick = async(user)=>{
        groupDetails.member = groupDetails.member.filter((m)=>{return m.senderId != user.id});
        let res = await axios.patch("http://localhost:5000/GroupChat/"+groupDetails.id,groupDetails);
        console.log(res);
        if(res.data.msg && res.data.msg == "Group Details Updated"){
            user.groupId = user.groupId.filter((id)=>{return id!=groupDetails.id});
            res = await axios.patch("http://localhost:5000/UserDetails/"+user.id,user);
            console.log(res);
        }
    }

    return <div className={style.overlay}>
        <div className={style.popup}>
        <button onClick={() => popupstate(false)} className={style.close}>&times;</button>
        <div className={style.header}>
            <img className={style.image} src="images/R.png" alt="A" />
            <h2>Remove Members</h2>
        </div>
            
            <div className={style.members}>
                {groupDetails.member.map((u) => (user.id != u.senderId) && <Member member={u} click={(user)=>handleClick(user)} remove={true}/>)}

            </div>
        </div>
    </div>
}

export default RemoveMembers;