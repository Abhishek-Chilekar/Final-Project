import React from "react";
import style from "./eventitem.module.css";
import { useSelector,useDispatch } from "react-redux";
import { events } from "../../Actions/thirdScreenAction";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import {updateWindow} from "../../Actions/windowAction";

const EventItem = (prop) => 
{
    const event = prop.event
    const dispatch = useDispatch();
    let [ownerName,setOwnerName] = useState("");
    const {width} = useSelector(state=>state.UpdateWindow);

    const userName = async() => {
        console.log(event.id);
        const user = await axios.get("http://localhost:5000/UserDetails/"+event.owner.senderId);
        setOwnerName(user.data[0].FullName);
    }
    useEffect(()=>{
        userName();
    },[])
    const handleOnClick = (event) => {
        dispatch(events({
            id:event.id,
            eventName:event.eventName,
            owner:{
                senderId:event.owner.senderId,
                role:event.owner.role,
                senderName:ownerName,
            },
            till:event.till,
            from:event.from,
            description:event.description,
            image:event.image,
            registeredUser:events.registeredUser
        }));
        if(width < 1040){
            dispatch(updateWindow(true));
        }
    }
    return <div className={style.list}>
                <div className={style.details}>
                    <img src={event.image} alt="event" className={style.image}/>
                    <div className={style.inner}>
                        <h1>{event.eventName}</h1>
                        <div className={style.role}>
                            <h2>{ownerName}</h2>
                        </div>
                    </div>
                </div>
                <button className={style.request} onClick={() => handleOnClick(event)}>View Event</button>
            </div>
}
export default EventItem;