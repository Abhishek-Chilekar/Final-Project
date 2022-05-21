import React from 'react';
import style from './GroupProfile.module.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { profiles } from '../../Actions/thirdScreenAction';

const Requests = ({id,accept,decline})=>{
    const [m,setM] = React.useState({});
    const dispatch = useDispatch();
    const getDetails=async()=>{
        const user = await axios.get("http://localhost:5000/UserDetails/"+id);
        const data = user.data[0];
        setM({
            name:data.FullName,
            photoUrl:data.photoUrl,
            role:data.role,
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
        <div className={style.member} >
            <div className={style.details} onClick={()=>show()}>
                <img className={style.image} src={m.photoUrl} alt="Profile pic"/>
                <h1 className={style.memberName}>{m.name}</h1>
            </div>
            <div className={style.buttons}>
                <img className={style.accept} src="/Images/accept.png" alt="plus" onClick={()=>{accept(m.details,m.role)}}/>
                <h1 className={style.decline} onClick={()=>{decline(id,m.details.branch)}}>x</h1>
            </div>
        </div>
    );
}

export default Requests;
