import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import style from "./notificationpanel.module.css";

const NotificationPanel = () => {

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("User"));

    const [unviewed,setUnviewed] = React.useState(false);

    const loadNotification = async() => {
        const res = await axios.get("http://localhost:5000/Notification");
        const noti = res.data.map((noti) => {
            console.log(noti);
            if(!noti.viewedList.includes(user.id))
            {
                setUnviewed(true);
            }
        });
    console.log(noti);
}
const viewNotification = () => {
    setUnviewed(false)
}
    
    React.useEffect(() => {
        loadNotification();
    },[]);
    return <div className={unviewed ? style.container : style.hideContainer}>
        <label className={style.notificationLabel}>Missed Notifications</label>
        <button className={style.viewButton} onClick = {viewNotification}>View</button>
    </div>
}

export default NotificationPanel;