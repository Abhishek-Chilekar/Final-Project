import axios from 'axios';
import React,{useState,useEffect} from 'react';
import { useDispatch } from 'react-redux';
import {events} from '../../Actions/thirdScreenAction'
import style from './Event.module.css';

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
const Event = (props) =>{
    const content = props.content;
    const [name,setName] = useState("");
    const dispatch = useDispatch();
    const handleOnClick=()=>{
        dispatch(events({
            id:content.id,
            eventName:content.eventName,
            owner:{
                senderId:content.owner.senderId,
                role:content.owner.role,
                senderName:name,
            },
            till:content.till,
            from:content.from,
            description:content.description,
            image:content.image,
            registeredUser:content.registeredUser
        }))
    }

//    useEffect(() => {
//     const fetchImage = async ()=>{
//         if(content.image == ""){
//         }
//         else{
//             try{
//                 await axios.get("http://localhost:5000/Storage/images/"+content.image);
//                 console.log("request sent to event api")
//             }
//             catch(e){
//                 console.log(e.message)
//             }
//         }
//     }
//     fetchImage();
//    }, [])
    const getUserName = async(id) =>{
        const user = await axios.get("http://localhost:5000/UserDetails/"+id);
        setName(user.data[0].FullName)
    }
    getUserName(content.owner.senderId);
    return (
    <div className={style.eventBox} onClick={()=>handleOnClick()}>
        <img className={style.eventLogo} src={content.image} alt="event icon"/>
        <div className={style.eventDetails}>
            <h1 className={style.eventName}>{content.eventName}</h1>
            <div className={style.moreDetails}>
                <h2 className={style.name}>{name}</h2>
                <h3 className={style.till}>{content.till}</h3>
            </div>
        </div>
    </div>
    )
}

export default React.memo(Event);