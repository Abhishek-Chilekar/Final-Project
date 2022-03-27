import axios from 'axios';
import React from 'react';
import style from './MessageBox.module.css';

const MessageBox = (props) =>{
    const user = JSON.parse(localStorage.getItem("User"));
    let [name,setName] = React.useState("");
    console.log(props.message)
    const msg = props.message;
    const m = msg.message;
    const time = m.timeline.split(",")[1];
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
        {msg.owner!=user.id?<h1 className={style.name}>{name}</h1>:<h1 className={style.name}>You</h1>}
        <p className={style.content}>{m.messageContent}</p>
        <h2 className={style.time}>{time}</h2>
    </div>)
}

export default MessageBox;