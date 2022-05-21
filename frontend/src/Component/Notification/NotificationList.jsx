import React,{useEffect,useState} from 'react';
import style from './NotificationList.module.css';
import Notification from './Notification';
import axios from 'axios';

const NotificationList = (props) =>{
    const [content,setContent] = useState([]);
    const [reload,setReload] = useState(false);
    const user = JSON.parse(localStorage.getItem("User"));
    
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
            console.log(res.data);
            setContent(res.data);
        }
        getNotificationList();
    },[])
    return(
    <div className={style.navList}>
        {content.map((n)=>((user.role != "Student"||(n.branch == "All" || n.branch == user.branch))&&(n.type == "All"||n.type == user.id)&&(!n.ignoreList.includes(user.id)))&&<Notification content={n} reload={[reload,setReload]}/>)}
    </div>
    );
}

export default NotificationList;