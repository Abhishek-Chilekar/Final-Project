import React,{useEffect,useState} from 'react';
import style from './NotificationList.module.css';
import Notification from './Notification';
import axios from 'axios';

const NotificationList = (props) =>{
    const [content,setContent] = useState([]);
    const [reload,setReload] = useState(false);
    
    useEffect(()=>{
        const getNotificationList = async()=>{
            const res = await axios.get("http://localhost:5000/Notification");
            console.log(res.data)
            setContent(res.data);
        }
        getNotificationList();
    },[reload])

    useEffect(()=>{
        const getNotificationList = async()=>{
            const res = await axios.get("http://localhost:5000/Notification");
            console.log(res.data)
            setContent(res.data);
        }
        getNotificationList();
    },[])
    return(
    <div className={style.navList}>
        {content.map((n)=><Notification content={n} reload={[reload,setReload]}/>)}
    </div>
    );
}

export default NotificationList;