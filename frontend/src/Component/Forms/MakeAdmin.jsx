import React from "react";
import style from "./makeadmin.module.css";
import axios from "axios";
import Member from "./Member";
import { useDispatch } from "react-redux";
import { reset } from "../../Actions/thirdScreenAction";

const MakeAdmin = ({popupstate,groupDetails,reload}) => {

    const user = JSON.parse(localStorage.getItem("User"));
    const dispatch = useDispatch();

    const handleClick = async(u)=>{
        groupDetails.member = groupDetails.member.map((m)=>{
            if(m.senderId == u.id){
                m.isAdmin = "true"
                return m;
            }
            else{
                return m;
            }
        });
        groupDetails.member = groupDetails.member.filter((m)=>{return m.senderId != user.id })
        let res = await axios.patch("http://localhost:5000/GroupChat/"+groupDetails.id,groupDetails);
        console.log(res);
        if(res.data.msg && res.data.msg == "Group Details Updated"){
            user.groupId = user.groupId.filter((id)=>{return id != groupDetails.id});
            res = await axios.patch("http://localhost:5000/UserDetails/"+user.id,user);
            localStorage.setItem("User",JSON.stringify(user));
            console.log(res);
            dispatch(reset());
            reload();
            popupstate(false);
        }
    }

    return <div className={style.overlay}>
    <div className={style.popup}>
        <button onClick={() => popupstate(false)} className={style.close}>&times;</button>
        <div className={style.header}>
            <img className={style.image} src="images/M.png" alt="A" />
            <h2>Make Admin</h2>
        </div>
            
        <div className={style.members}>
            {groupDetails.member.map((m)=>(m.senderId != user.id)&&<Member member={m} click={(user)=>handleClick(user)} remove={false}/>)}
        </div>
    </div>
    </div>
}

export default MakeAdmin;