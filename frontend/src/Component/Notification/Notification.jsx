import axios from 'axios';
import React,{useState} from 'react';
import style from './Notification.module.css';


/*
[{
    image:
    purpose:
    heading:
    content:
    id:
    url:
    branch:
}]
*/
const Notification = (props) =>{
    const content = props.content;
    console.log(content);

    const handleDelete = async()=>{
        try{
            const res = await axios.delete("http://localhost:5000/Notification/"+content.id);
            console.log(res.data.msg);
        }
        catch(e){
            console.log(e.message);
        }
    }

    return (
    <div className={style.Notification}>
       <div className={style.main}>
            {props.del&&<img className={style.delete} src="" alt="delete"/>}
            <img className={style.icon} src={content.purpose=="event"?"http://localhost:5000/Images/"+content.image:content.image} alt="image"/>
            <div className={style.details}>
                <h1 className={style.heading}>{content.heading}</h1>
                <h2 className={style.description}>{content.content}</h2>
            </div>
        </div>
        <div>
            <span className={style.button}>{content.purpose == "group"?"Join":(content.purpose="resource"||content.purpose=="event")&&"View"}</span>
            <span className={style.button} onClick={()=>handleDelete()}>Delete</span>
        </div>
    </div>
    );
}

export default Notification;