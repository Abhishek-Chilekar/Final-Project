import axios from "axios";
import React from "react";
import style from "./groupoptionslist.module.css";
import { useDispatch } from "react-redux";
import { reset } from "../../Actions/thirdScreenAction";
import {chatAction} from "../../Actions/navActions";

const GroupOptionsList = (prop) => {
    const user = JSON.parse(localStorage.getItem("User"));
    const dispatch = useDispatch();
    const popupstate = prop.popupstate;

    const handleLeave = async()=>{
        const memberDetails = prop.groupDetails.member.filter((m)=>{return m.senderId == user.id})[0];
        if(memberDetails.isAdmin == "true"){
            prop.makeAdmin(true);
            popupstate();
        }
        else{
            dispatch(reset());
            prop.groupDetails.member = prop.groupDetails.member.filter((m)=>{return m.senderId != user.id});
            let res = await axios.patch("http://localhost:5000/GroupChat/"+prop.groupDetails.id,prop.groupDetails);
            console.log(res);
            if(res.data.msg && res.data.msg == "Group Details Updated"){
                user.groupId = user.groupId.filter((id)=>{return id != prop.groupDetails.id});
                res = await axios.patch("http://localhost:5000/UserDetails/"+user.id,user);
                localStorage.setItem("User",JSON.stringify(user));
                console.log(res);
                prop.reload();
                popupstate();
            }
        }
    }

    const handleDelete = async ()=>{
        try{
            dispatch(reset());
            const res = await axios.delete("http://localhost:5000/GroupChat/"+prop.groupDetails.id);
            if(res.data.msg == "group deleted"){
                const notires = await axios.get("http://localhost:5000/Notification/");
                const notifications = notires.data;
                if(notifications){
                    const notitobedel = notifications.filter((n)=>{return n.contentId == prop.groupDetails.id});
                    notitobedel.length > 0 && await axios.delete("http://localhost:5000/Notification/"+notitobedel[0].id);
                }
                user.groupId = user.groupId.filter((id)=>{return id != prop.groupDetails.id});
                console.log(user);
                const userres = await axios.patch("http://localhost:5000/UserDetails/"+user.id,user);
                if(userres.data.msg == "data updated"){
                    localStorage.setItem('User',JSON.stringify(user));
                    prop.reload();
                }
            }
        }
        catch(e){
            console.log(e.message);
        }
    }
    
    console.log(prop.check);
    return <div className={prop.action ? style.dropdownActive : style.dropdown}>
            <ul>
               {prop.check == user.id && <li onClick={()=>{prop.add(true);popupstate()}}>Add Member</li>}
               {prop.check == user.id && <li onClick={()=>{prop.remove(true);popupstate()}}>Remove Member</li>}
               <li onClick={()=>{prop.groupDetails.member.length == 1?handleDelete():handleLeave()}}>{prop.groupDetails.member.length == 1 ? "Delete the group":"Leave Group"}</li>
               <li onClick={()=>{prop.poll(true);popupstate()}}>Create a poll</li>
            </ul>
    </div>
}

export default GroupOptionsList;