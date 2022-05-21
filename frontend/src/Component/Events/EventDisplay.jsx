import React from 'react';
import { useDispatch } from 'react-redux';
import style from '../Resources/ResourceDisplay.module.css';
import axios from 'axios';
import {storage} from '../firebaseConfig';
import {ref,deleteObject} from "@firebase/storage";
import { reset } from '../../Actions/thirdScreenAction';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'react-external-link';
import { eventAction } from '../../Actions/navActions';

/*
    [{
        eventId :
        eventName:
        owner:{senderId: , role:}
        till:
        from:
        description:
        image:
        registeredUser:[userId]
    }]
*/

const EventDisplay = ({content}) =>{
    const currentUser = JSON.parse(localStorage.getItem("User"));
    const dispatch = useDispatch();
    const current = content;
    console.log(current);
    const handleOnClick = async()=>{
        try{
            const storageRef = ref(storage,current.image);
            await deleteObject(storageRef);
            const res = await axios.delete("http://localhost:5000/Events/"+current.id);
            console.log(res.data.msg);
            const notires = await axios.get("http://localhost:5000/Notification/");
            const notifications = notires.data;
            if(notifications){
                const notitobedel = notifications.filter((n)=>{return n.contentId == current.id});
                notitobedel.length > 0 && await axios.delete("http://localhost:5000/Notification/"+notitobedel[0].id);
            }
            content.reload();
            dispatch(reset());
        }
        catch(e){
            console.log(e.message);
        }
    }

    const open=()=>{
        window.open(current.url,"_blank");
    }

    return (
        <div className={style.ResourceDisplay}>
            <div className={style.resourceHeader}>
                <img className={style.image} src={current.image} alt="resource type"/>
                <h1 className={style.title}> {current.eventName} </h1>
            </div>
            <div className={style.data}>
                <h3 className={style.label}> Name :  </h3>
                <p className={style.value}> {current.eventName} </p>
                <h3 className={style.label}> Owner :  </h3>
                <p className={style.value}> {current.owner.senderName} </p>
                <h3 className={style.label}> from :  </h3>
                <p className={style.value}> {current.from} </p>
                <h3 className={style.label}> till :  </h3>
                <p className={style.value}> {current.till} </p>
                <h3 className={style.label}> Description :  </h3>
                <p className={style.value}> {current.description} </p>
                <div className={style.buttonContainer}>
                   {content.owner.senderId == currentUser.id &&<button className={style.button} onClick={()=>handleOnClick()}> Delete </button>}
                    <ExternalLink href={current.url} className={style.link}> Register </ExternalLink>
                </div>
            </div>
        </div>
    );
}

export default EventDisplay;