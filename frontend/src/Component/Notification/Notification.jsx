import axios from 'axios';
import React,{useState,useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { eventAction, resourceAction } from '../../Actions/navActions';
import { events, resources } from '../../Actions/thirdScreenAction';
import { updateWindow } from '../../Actions/windowAction';
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
    viewed:
}]
*/
const Notification = (props) =>{
    const content = props.content;
    const {width} = useSelector(state=>state.UpdateWindow);
    const [reload,setReload] = props.reload;
    const [username,setUsername] = React.useState("");
    const [isMember,setIsMember] = React.useState(false);
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
                const user1 = JSON.parse(localStorage.getItem("User"));
                groupDetails.requests = [...groupDetails.requests,user1.id];
                let res = await axios.patch("http://localhost:5000/GroupChat/"+groupDetails.id,groupDetails);
                console.log(res);
                if(res.data.msg == "Group Details Updated"){
                    handleIgnore();
                }
                break;
            case "resource":
                const re = await axios.get("http://localhost:5000/Resources/"+content.contentId);
                const user = await axios.get("http://localhost:5000/UserDetails/"+re.data[0].owner.senderId);
                const resource = re.data[0];
                const obj={
                    id:resource.id,
                    resourceName:resource.resourceName,
                    owner:{
                        senderId:resource.owner.senderId,
                        role:resource.owner.role,
                        senderName:user.data[0].FullName,
                    },
                    type:resource.type,
                    size:resource.size,
                    description:resource.description,
                    url:resource.url
                }
                dispatch(resources(obj));
                dispatch(resourceAction());
                if(width < 1040){
                    dispatch(updateWindow(true));
                }
                break;
            case "event":
                const r = await axios.get("http://localhost:5000/Events/"+content.contentId);
                const u = await axios.get("http://localhost:5000/UserDetails/"+r.data[0].owner.senderId);
                dispatch(events({...r.data[0],owner:{...r.data[0].owner,senderName:u.data[0].FullName}}));
                dispatch(eventAction());
                if(width < 1040){
                    dispatch(updateWindow(true));
                }
                break;
            default:
                break;
        }
    }
    const onLoad = async() => {
        if(content.purpose == "group")
        {
            const data = await axios.get("http://localhost:5000/GroupChat/"+content.contentId);
            if(data.data.length != 0){
                const group = data.data[0];

                const member = group.member.filter((m)=>{return m.senderId == user.id});
                if(member.length != 0){
                    setIsMember(true);
                }
            }
        }
    }
    const focus = async() => {
        content.viewedList = [...content.viewedList,user.id];
        const d = await axios.patch("http://localhost:5000/Notification/"+content.id,content);
    }
    useEffect(() => {
        onLoad();
    }, []);
    return (
    <div className={style.Notification} onMouseEnter = {()=>focus()}>
       <div className={style.main}>
            {props.del&&<img className={style.delete} src="" alt="delete"/>}
            <img className={style.icon} src={content.image} alt="image"/>
            <div className={style.details}>
                <h1 className={style.heading}>{content.heading}</h1>
                <h2 className={style.description}>{content.content}</h2>
            </div>
        </div>
        <div className={style.buttonContainer}>
            {content.type == "All"&& !(content.purpose == "group" && isMember) &&<span className={style.button} onClick={()=>handleView()}>{(content.purpose == "group")?"Join":(content.purpose=="resource"||content.purpose=="event")&&"View"}</span>}
            {content.type != "All"&&<span className={style.button} onClick={()=>handleDelete()}>Delete</span>}
            {content.type == "All"&&<span className={style.button} onClick={()=>handleIgnore()}>Ignore</span>}
        </div>
    </div>
    );
}

export default Notification;