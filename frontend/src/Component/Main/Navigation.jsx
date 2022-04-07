import React, { useState,useEffect } from 'react';
import style from './Navigation.module.css';
import { useDispatch,useSelector } from 'react-redux';
import {auth} from '../firebaseConfig';
import {chatAction,resourceAction,eventAction,aboutAction,notificationAction,profileAction} from '../../Actions/navActions';
import {logout} from '../../Actions/userAction';
import { useNavigate } from 'react-router-dom';
import { reset , profiles } from '../../Actions/thirdScreenAction';

const Navigation = () => {
    const user = JSON.parse(localStorage.getItem("User"));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [chat , setChat] = useState(true);
    const [resource , setResource] = useState(true);
    const [event , setEvent] = useState(true);
    const [notification , setNotification] = useState(true);
    const [about , setAbout] = useState(true);
    const [log , setLog] = useState(true);

    useEffect(() => {
        if(!user){
            navigate('/Login');
        }
    }, [])

    const handleLogOut =() =>{
        try{
            auth.signOut();
            dispatch(logout());
            localStorage.removeItem("User");
            navigate('/Login');
        }
        catch(e){
            console.log(e.message);
        }
    }

    const handleEvent = (choice)=>{
        switch(choice){
            case 1:
                setChat(!chat);
                break;
            case 2:
                setResource(!resource)
                break;
            case 3:
                setEvent(!event)
                break;
            case 4:
                setNotification(!notification)
                break;
            case 5:
                setAbout(!about);
                break;
            case 6:
                setLog(!log);
                break;
        }
    }

    const handleClick =() =>{
        dispatch(profiles(user))
    }
    return (<div className={style.container}>
        <div className={style.container1} onClick={()=>handleClick()}>
            <img className={style.avatar} src={user.photoUrl?user.photoUrl:"/Images/avatardefault.png"} alt="profile" />
            <label className={style.name} htmlFor="">{user?user.FullName:"ABCD"}</label>
        </div>

        <div className={style.container2}>
            <div className={style.tab} onMouseOver={()=>handleEvent(1)} onMouseOut={()=>handleEvent(1)} onClick={()=>{dispatch(reset());dispatch(chatAction())}}>  <img src={"/Images/"+(chat?"chat.png":"Chat1.png")} alt="chat" className={style.image} /><label className={style.text}>Chat</label>  </div>
            <div className={style.tab} onMouseOver={()=>handleEvent(2)} onMouseOut={()=>handleEvent(2)} onClick={()=>{dispatch(reset());dispatch(resourceAction())}}>  <img src={"/Images/"+(resource?"resources.png":"Resource1.png")} alt="resources" className={style.image} /><label className={style.text}>Resources</label>  </div>
            <div className={style.tab} onMouseOver={()=>handleEvent(3)} onMouseOut={()=>handleEvent(3)} onClick={()=>{dispatch(reset());dispatch(eventAction())}}>  <img src={"/Images/"+(event?"events icon.png":"Event icon1.png")} alt="event" className={style.image} /><label className={style.text}>Events</label></div>
            <div className={style.tab} onMouseOver={()=>handleEvent(4)} onMouseOut={()=>handleEvent(4)} onClick={()=>{dispatch(reset());dispatch(notificationAction())}}>  <img src={"/Images/"+(notification?"notifications.png":"Notification1.png")} alt="notification" className={style.image} /><label className={style.text}>Notifications</label></div>
            <div className={style.tab} onMouseOver={()=>handleEvent(5)} onMouseOut={()=>handleEvent(5)} onClick={()=>{dispatch(reset());dispatch(aboutAction())}}>  <img src={"/Images/"+(about?"about.png":"About1.png")} alt="about" className={style.image} /><label className={style.text}>About us</label></div>
        </div>
        
        <div className={style.container3}>
            <div className={style.logout}  onMouseOver={()=>handleEvent(6)} onMouseOut={()=>handleEvent(6)} onClick={()=>handleLogOut()}>   <img src={"/Images/"+(log?"logout.png":"Logout1.png")} alt="logo out" className={style.image}/><label className={style.text}>Logout</label></div>
        </div>
        
    </div>)
}

export default Navigation;