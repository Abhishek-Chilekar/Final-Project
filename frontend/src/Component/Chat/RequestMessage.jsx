import axios from 'axios';
import React from 'react';
import style from './RequestMessage.module.css';
import { useDispatch } from 'react-redux';
import { profiles } from '../../Actions/thirdScreenAction';

// {
//     requestId:"1",
//     senderName:"Anita",
//     skills:["WEB-DEV","Content Writing","Designing"],
//     requestMessage:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
// }
const RequestMessage = (props) =>{
    const dispatch = useDispatch();
    const [content,setContent] = React.useState({});
    const currentUser = JSON.parse(localStorage.getItem("User"));
    const [disabled,setDisabled] = React.useState(false);
    const formatData = async(data)=>{
        const res = await axios.get("http://localhost:5000/UserDetails/"+data.senderId);
        const user = res.data[0];
        setContent({
            requestId:data.requestId,
            requestMessage:data.requestMessage,
            senderName:user.FullName,
            skills:user.skillset,
            photoUrl:user.photoUrl?user.photoUrl:"/Images/avatardefault.png",
        })
    }

    
    const show =async(id)=>{
        const {data} = await axios.patch("http://localhost:5000/UserDetails/"+id);
        dispatch(profiles(data[0]));
    }


    React.useEffect(()=>{
        formatData(props.content);
    },[])
    return (
        <div className={style.messageBox} >
            <img className={style.profilePic} src={content.photoUrl} alt="group icon" onClick={()=>show(props.content.senderId)}/>
            <div className={style.info}>
                <div className={style.container}>
                    <h1 className={style.name}>{content.senderName}</h1>
                   {content.skills&&<div className={style.skillContainer}>{content.skills.map((m)=><h1 className={style.skill}>{m}</h1>)}</div>}
                </div>
                <p className={style.message}>
                    {content.requestMessage}
                </p>  
                <span className={style.buttonContainer}>
                    <h2 className={style.accept} onClick={()=>props.handleAccept(props.content,setDisabled,disabled)}><img className={style.icon} src="/images/accept.png" alt="accept" />Accept</h2>
                    <h2 className={style.decline} onClick={()=>props.handleDecline(props.content,setDisabled,disabled)}><img className={style.icon} src="/images/decline.png" alt="decline" />Decline</h2>
                </span>
            </div>
        </div>
    )
}

export default RequestMessage;