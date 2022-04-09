import axios from 'axios';
import React from 'react';
import { useDispatch } from 'react-redux';
import { profiles } from '../../Actions/thirdScreenAction';
import style from './GroupProfile.module.css'


const Member=({details})=>{
    const [m,setM] = React.useState({});
    const dispatch = useDispatch();
    const getDetails=async()=>{
        const user = await axios.get("http://localhost:5000/UserDetails/"+details.senderId);
        const data = user.data[0];
        setM({
            name:data.FullName,
            role:details.role,
            isAdmin:details.isAdmin,
            photoUrl:data.photoUrl,
            details:data,
        });
    }

    const show = ()=>{
        dispatch(profiles(m.details));
    }

    React.useEffect(()=>{
        getDetails();
    },[])
    return(
    <div className={style.member} onClick={()=>{show()}}>
        <div className={style.details}>
            <img className={style.image} src={m.photoUrl} alt="Profile pic"/>
            <h1 className={style.memberName}>{m.name}</h1>
        </div>
        <span className={m.isAdmin == "true"?style.role:style.studentRole}>{m.isAdmin=="true"?"Admin":m.role}</span>
    </div>
    );
}

export default Member; 