import axios from 'axios';
import React,{useState} from 'react';
import { useDispatch } from 'react-redux';
import { events, resources } from '../../Actions/thirdScreenAction';
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
    const [reload,setReload] = props.reload;
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("User"));

    const handleDelete = async()=>{
        try{
            const res = await axios.delete("http://localhost:5000/Notification/"+content.id);
            console.log(res.data.msg);
            setReload(!reload);
        }
        catch(e){
            console.log(e.message);
        }
    }

    const handleIgnore=async()=>{
        content.ignoreList = [...content.ignoreList,user.id];
        const res = await axios.patch("http://localhost:5000/Notification/"+content.id,content);
        console.log(res);
        if(res.data.msg == "Notification Updated"){
            setReload(!reload);
        }
    }

    const handleView =async()=>{
        
        switch(content.purpose){
            case "group":
                const {data} = await axios.get("http://localhost:5000/GroupChat/"+content.contentId);
                const groupDetails = data[0];
                console.log(groupDetails);
                groupDetails.requests = [...groupDetails.requests,user.id];
                let res = await axios.patch("http://localhost:5000/GroupChat/"+groupDetails.id,groupDetails);
                console.log(res);
                if(res.data.msg == "Group Details Updated"){
                    handleIgnore();
                }
                break;
            case "resource":
                const re = await axios.get("http://localhost:5000/Resources/"+content.contentId);
                dispatch(resources(re.data[0]));
                break;
            case "event":
                const r = await axios.get("http://localhost:5000/Events/"+content.contentId);
                dispatch(events(r.data[0]));
                break;
            default:
                break;
        }
    }

    return (
    <div className={style.Notification}>
       <div className={style.main}>
            {props.del&&<img className={style.delete} src="" alt="delete"/>}
            <img className={style.icon} src={content.image} alt="image"/>
            <div className={style.details}>
                <h1 className={style.heading}>{content.heading}</h1>
                <h2 className={style.description}>{content.content}</h2>
            </div>
        </div>
        <div>
            {content.type == "All"&&<span className={style.button} onClick={()=>handleView()}>{(content.purpose == "group")?"Join":(content.purpose=="resource"||content.purpose=="event")&&"View"}</span>}
            {content.type != "All"&&<span className={style.button} onClick={()=>handleDelete()}>Delete</span>}
            {content.type == "All"&&<span className={style.button} onClick={()=>handleIgnore()}>Ignore</span>}
        </div>
    </div>
    );
}

export default Notification;