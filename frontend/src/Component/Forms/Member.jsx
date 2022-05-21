import axios from "axios";
import React from "react";
import style from "./Member.module.css";


const Member = ({member,click,remove})=>{

    const [user,setUser] = React.useState({});
    const [status,setStatus] = React.useState(false);

    const getData = async()=>{
        const res = await axios.get("http://localhost:5000/UserDetails/"+member.senderId);
        setUser(res.data[0]);
    }
    React.useEffect(()=>{
        getData();
    },[])
    return  <>
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
        <button className={style.butto} onClick={status?()=>{}:()=>{setStatus(true);click(user)}}>{remove?(status?"Removing":"Remove"):(status?"Choosing":"Choose")}</button>
    </div>
</>
}

export default Member;