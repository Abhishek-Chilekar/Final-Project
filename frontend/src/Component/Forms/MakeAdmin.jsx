import React from "react";
import style from "./makeadmin.module.css";
import axios from "axios";

const MakeAdmin = ({popupstate,groupDetails}) => {
    
    const [memberDetails,setMemberDetails] = React.useState([]);
    const user = JSON.parse(localStorage.getItem("User"));

    const getMemberDetails = ()=>{
        groupDetails.member.map(async(m)=>{
            if(m.senderId != user.id){
                const res = await axios.get("http://localhost:5000/UserDetails/"+m.senderId);
                setMemberDetails([...memberDetails,res.data[0]]);
            }

        });
    }

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
        }
    }

    React.useEffect(()=>{getMemberDetails();},[]);

    return <div className={style.overlay}>
        <div className={style.popup}>
        <button onClick={() => popupstate(false)} className={style.close}>&times;</button>
        <div className={style.header}>
            <img className={style.image} src="images/M.png" alt="A" />
            <h2>Make Admin</h2>
        </div>
            
        <div className={style.members}>
                {memberDetails.map((user) => {
                    return <>
                        <div className={style.container}>
                            <div className={style.innercontainer}>
                            <img className={style.profileImg} src={user.photoUrl} alt="Profile" />
                            <div className={style.username}>
                                <h1 className={style.Name}>{user.FullName}</h1>
                                <div className={style.role}>
                                    <div className={(user.role === "Student") ? style.student : (user.role === "Teacher") ? style.teacher: style.alumni}></div>
                                    <span className={style.roleName}>{user.role}</span>
                                </div>
                            
                            </div>
                            </div>
                            <button className={style.butto} onClick={()=>handleClick(user)}>Choose</button>
                        </div>
                    </>
                })}

            </div>
        </div>
    </div>
}

export default MakeAdmin;