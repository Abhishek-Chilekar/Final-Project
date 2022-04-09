import axios from 'axios';
import React from 'react';
import style from './ChatDisplay.module.css';
import MessageBox from './MessageBox';
import {storage} from '../firebaseConfig';
import { useDispatch } from 'react-redux';
import { profiles } from '../../Actions/thirdScreenAction';
import {ref,uploadBytesResumable,getDownloadURL,deleteObject} from "@firebase/storage";

const ChatDisplay = ({content}) =>{
    const {senderChat,receiverChat,receiver,reloadList} = content;
    const user = JSON.parse(localStorage.getItem("User"));
    const date = new Date();
    let [reload,setReload] = React.useState(false);
    const [disabled,setDisabled] = React.useState(false);
    const [disabledButton,setDisabledButton] = React.useState(false);
    const [sendingStatus,setSendingStatus] = React.useState("");
    const formatData = ()=>{
        return {
            photoUrl:receiver.photoUrl?receiver.photoUrl:"/Images/avatardefault.png",
            name:receiver.FullName,
            role:receiver.role,
            messages:senderChat.chats
        }
    }

    const current = formatData();
    React.useEffect(() => {
    },[reload])
    let [text,setText] = React.useState("");
    let [file,setFile] = React.useState(null);
    const dispatch = useDispatch();


    React.useEffect(()=>{},[reload]);

    const handleClear=async()=>{
        senderChat.chats = []
        current.messages = []
    
        let res = await axios.patch("http://localhost:5000/PrivateChat/"+senderChat.senderId+senderChat.receiverId,senderChat);
        console.log(res.data.msg);
        res = await axios.patch("http://localhost:5000/PrivateChat/"+receiverChat.senderId+receiverChat.receiverId,receiverChat);
        console.log(res.data.msg);
        reloadList();
        setReload(!reload);
    }

    const handleDelete = async(id) =>{
        if(!disabled){
        try{
            setDisabled(true);
            const message = current.messages.filter((m)=>{return m.message.messageId == id})[0];
            console.log(message)
            if(message.message.type == "text"){
                senderChat.chats = senderChat.chats.filter((m)=>{return m.message.messageId != id})
                receiverChat.chats = receiverChat.chats.filter((m)=>{return m.message.messageId != id})
                current.messages = current.messages.filter((m)=>{return m.message.messageId != id})
            
                let res = await axios.patch("http://localhost:5000/PrivateChat/"+senderChat.senderId+senderChat.receiverId,senderChat);
                console.log(res.data.msg);
                res = await axios.patch("http://localhost:5000/PrivateChat/"+receiverChat.senderId+receiverChat.receiverId,receiverChat);
                console.log(res.data.msg);
                reloadList();
                setReload(!reload);
            }
            else{
                const storageRef = ref(storage,message.message.messageContent);
                await deleteObject(storageRef);
                senderChat.chats = senderChat.chats.filter((m)=>{return m.message.messageId != id})
                receiverChat.chats = receiverChat.chats.filter((m)=>{return m.message.messageId != id})
                current.messages = current.messages.filter((m)=>{return m.message.messageId != id})
            
                let res = await axios.patch("http://localhost:5000/PrivateChat/"+senderChat.senderId+senderChat.receiverId,senderChat);
                console.log(res.data.msg);
                res = await axios.patch("http://localhost:5000/PrivateChat/"+receiverChat.senderId+receiverChat.receiverId,receiverChat);
                console.log(res.data.msg);
                reloadList();
                setReload(!reload);
            }
            setDisabled(false);
        }
        catch(e){
            console.log(e.message)
            setDisabled(false);
        }
      }
    }

    const handleSend = async()=>{
        if(!disabledButton){
        setDisabledButton(true);
        if(!file){
            setSendingStatus("Sending");
            const message = {
                owner:user.id,
                message:{
                    messageId:user.id+date.toLocaleString(),
                    messageContent:text,
                    type:"text",
                    timeline:date.toLocaleString()
                }
            }
    
            senderChat.chats = [...senderChat.chats,message];
            receiverChat.chats = [...receiverChat.chats,message];
            current.messages = [...current.messages,message];
    
            console.log(senderChat);
    
            let res = await axios.patch("http://localhost:5000/PrivateChat/"+senderChat.senderId+senderChat.receiverId,senderChat);
            console.log(res.data.msg);
            res = await axios.patch("http://localhost:5000/PrivateChat/"+receiverChat.senderId+receiverChat.receiverId,receiverChat);
            console.log(res.data.msg);
            setText("");
            setSendingStatus("");
            reloadList();
            setDisabledButton(false);
            setReload(!reload);
        }
        else{
            setSendingStatus("Sending")
            const storageRef = ref(storage,"/PrivateChat/"+senderChat.senderId+senderChat.receiverId+"/"+file.name);
            console.log(file.name);
        
            const uploadTask = uploadBytesResumable(storageRef,file);
            uploadTask.on("state_changed",(snapshot) => {
                setSendingStatus("Uploading")
            },(err) => {
                console.log(err.message);
            },() => {
                try{
                    setSendingStatus("Uploaded")
                        getDownloadURL(uploadTask.snapshot.ref).then(async(link)=>{
                            const message = {
                                owner:user.id,
                                message:{
                                    messageId:user.id+date.toLocaleString(),
                                    messageContent:link,
                                    type:"image",
                                    timeline:date.toLocaleString()
                                }
                            }
                    
                            senderChat.chats = [...senderChat.chats,message];
                            receiverChat.chats = [...receiverChat.chats,message];
                            current.messages = [...current.messages,message];
                    
                            console.log(senderChat);
                    
                            let res = await axios.patch("http://localhost:5000/PrivateChat/"+senderChat.senderId+senderChat.receiverId,senderChat);
                            console.log(res.data.msg);
                            res = await axios.patch("http://localhost:5000/PrivateChat/"+receiverChat.senderId+receiverChat.receiverId,receiverChat);
                            console.log(res.data.msg);
                            setFile(null);
                            reloadList();
                            setSendingStatus("");
                            setDisabledButton(false);
                            setReload(!reload);
                        })
                }
                catch(e){
                    console.log(e.message);
                    setDisabledButton(false);
                }
            });
        }
      }
    }

    const show = ()=>{
        dispatch(profiles(receiver));
    }
    
    // const current = {
    //     photoUrl:"/Images/avatardefault.png",
    //     name:"Sandy",
    //     role:"Student",
    //     messages:[{
    //         owner:{
    //             name:"Sandy",
    //         },
    //         message:{
    //             messageId:"1",
    //             timeline:"9:30 pm",
    //             messageContent:{
    //                 text:"hello hello hello hello hello hello hello hello"
    //             }
    //         }
    //     }
    //  ]
    // }
    return (
    <div className={style.chatDisplay}>
        <div className={style.header} >
            <div className={style.profile} onClick={()=>show()}>
                <img className={style.profilepic} src={current.photoUrl} alt="profile pic"/>
                <div>
                    <h1 className={style.name}>{current.name}</h1>
                    <div className={style.role}>
                        <div className={style.roleIndicator}></div>
                        <h2 className={style.role}> {current.role} </h2>
                    </div>
                </div>
            </div>
            <img className={style.menu} src="/Images/menu icon.png" alt="menu" onClick={()=>handleClear()}/>
        </div> 
        <div className={style.mda}>
            {current.messages.map((m)=><MessageBox message={m} delete={handleDelete}/>)}
        </div>  
        <div className={style.typingArea}>
            <label className={style.imageBack} for="select"><img className={style.image} src="/Images/image.png" alt="image"/></label>
            <input type="file" name="select" id="select" className={style.select} onChange={(e)=>setFile(e.target.files[0])}/>
            <input className={style.input} type="text" id="text" name="text" placeholder='Type Here...' value={text} onChange={(e)=>{setText(e.target.value)}}/>
            <span className={style.sendBack}><img className={style.send} src="/Images/send icon.png" alt="send icon" onClick={()=>handleSend()}/><span>{sendingStatus}</span></span>
        </div> 
    </div>);
}

export default ChatDisplay;