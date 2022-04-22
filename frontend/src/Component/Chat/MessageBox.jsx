import axios from 'axios';
import React from 'react';
import style from './MessageBox.module.css';
import ViewImage from './ViewImage';

const MessageBox = (props) =>{
    const user = JSON.parse(localStorage.getItem("User"));
    let [name,setName] = React.useState("");
    let [hover,setHover] = React.useState(false);
    const [openPopup,setOpenPopup] = React.useState(false);
    const msg = props.message;
    const m = msg.message;
    const time = m.timeline.split(",")[1];
    const viewImage = () => {
        setOpenPopup(!openPopup);
    }
    const getName = async() =>{
        try{
            const data = await axios.get("http://localhost:5000/UserDetails/"+msg.owner);
            setName(data.data[0].FullName);
        }
        catch(e){
            console.log(e.message)
        }
    }
    React.useEffect(() => {
        getName();
    }, [])
    return(
    <div className={msg.owner==user.id?style.ownerBox:style.friendBox}>
        <div className={style.header}>
            {msg.owner!=user.id?<h1 className={style.name}>{name}</h1>:<h1 className={style.name}>You</h1>}
            {msg.owner==user.id&&<img className={style.menu} src="/Images/deleteBlack.png" alt="menu icon" onClick={()=>props.delete(m.messageId)}/>}
        </div>
        {m.type == "text"&&<p className={msg.owner==user.id?style.content:style.contentRight}>{m.messageContent}</p>}
        {m.type == "image"&&<img src={m.messageContent} alt="shared image" className={style.sharedImg} onClick = {() => viewImage()}/>}
        {openPopup && <ViewImage popupstate={setOpenPopup} imagesrc = {m.messageContent}/>}
        <h2 className={style.time}>{m.timeline.split(",")[1]}</h2>
    </div>)
}

export default MessageBox;