import axios from 'axios';
import React from 'react';
import style from './ChatDisplay.module.css';
import MessageBox from './MessageBox';
import {storage} from '../firebaseConfig';
import { useDispatch } from 'react-redux';
import { chats, profiles } from '../../Actions/thirdScreenAction';
import {ref,uploadBytesResumable,getDownloadURL,deleteObject} from "@firebase/storage";
import { chatAction } from '../../Actions/navActions';


const ChatDisplay = ({content}) =>{
    const [receiver,setReceiver] = React.useState(content.receiver);
    const [senderChat,setSenderChat] = React.useState(content.senderChat);
    const [receiverChat,setReceiverChat] = React.useState(content.receiverChat);
    const user = JSON.parse(localStorage.getItem("User"));
    const date = new Date();
    const [disabled,setDisabled] = React.useState(false);
    const [disabledButton,setDisabledButton] = React.useState(false);
    const [sendingStatus,setSendingStatus] = React.useState("");
    const [text,setText] = React.useState("");
    const [file,setFile] = React.useState(null);
    const dispatch = useDispatch();

    const formatData = async()=>{
        let res = await axios.get("http://localhost:5000/PrivateChat/"+content.senderChat.id);
        if(!res.data.msg){
            setSenderChat(res.data);
        }
        res = await axios.get("http://localhost:5000/PrivateChat/"+content.receiverChat.id);
        if(!res.data.msg){
            setReceiverChat(res.data);
        }
        setReceiver(content.receiver);
    }

    React.useEffect(()=>{
        formatData();
    },[]);

    React.useEffect(()=>{
        formatData();
    },[content.receiver]);

    React.useEffect(()=>{
        const interval = setInterval(()=>formatData(),500);
        return ()=>clearInterval(interval);
    },[content.receiver]);

    const handleClear=async()=>{
        let sdata = senderChat;
        sdata.chats = [];
        let res = await axios.patch("http://localhost:5000/PrivateChat/"+senderChat.id,sdata);
        console.log(res.data.msg);
        dispatch(chatAction());
    }

    const handleDelete = async(id) =>{
        if(!disabled){
        try{
            setDisabled(true);
            const message = senderChat.chats.filter((m)=>{return m.message.messageId == id})[0];
            if(message.message.type == "text"){
                let sdata = senderChat;
                let rdata = receiverChat;
                sdata.chats = sdata.chats.filter((m)=>{return m.message.messageId != id})
                rdata.chats = rdata.chats.filter((m)=>{return m.message.messageId != id})
            
                let res = await axios.patch("http://localhost:5000/PrivateChat/"+senderChat.id,sdata);
                res = await axios.patch("http://localhost:5000/PrivateChat/"+receiverChat.id,rdata);
                dispatch(chatAction());
            }
            else{
                let sdata = senderChat;
                let rdata = receiverChat;
                const storageRef = ref(storage,message.message.messageContent);
                await deleteObject(storageRef);
                sdata.chats = sdata.chats.filter((m)=>{return m.message.messageId != id})
                rdata.chats = rdata.chats.filter((m)=>{return m.message.messageId != id})
            
                let res = await axios.patch("http://localhost:5000/PrivateChat/"+senderChat.id,sdata);
                res = await axios.patch("http://localhost:5000/PrivateChat/"+receiverChat.id,rdata);
                dispatch(chatAction());
            }
            setDisabled(false);
        }
        catch(e){
            console.log(e.message)
            setDisabled(false);
        }
      }
    }

    const show = ()=>{
        dispatch(profiles(receiver));
    }

    const handleSend = async()=>{
        if(!disabledButton){
        setDisabledButton(true);
        if(!file){
            let sdata = senderChat;
            let rdata = receiverChat;
            setSendingStatus("Sending");
            const message = {
                owner:user.id,
                message:{
                    messageId:user.id+date.toLocaleString(),
                    messageContent:text,
                    type:"text",
                    imagePath:"",
                    timeline:date.toLocaleString()
                }
            }
    
            sdata.chats = [...sdata.chats,message];
            rdata.chats = [...rdata.chats,message];
    
            let res = await axios.patch("http://localhost:5000/PrivateChat/"+senderChat.id,sdata);
            res = await axios.patch("http://localhost:5000/PrivateChat/"+receiverChat.id,rdata);
            setText("");
            setSendingStatus("");
            dispatch(chatAction());
            setDisabledButton(false);
        }
        else{
            let sdata = senderChat;
            let rdata = receiverChat;
            setSendingStatus("Sending")
            const storageRef = ref(storage,"/PrivateChat/"+senderChat.id+"/"+file.name);
        
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
                                    imagePath:"/PrivateChat/"+senderChat.senderId+senderChat.receiverId+"/"+file.name,
                                    timeline:date.toLocaleString()
                                }
                            }
                    
                            sdata.chats = [...sdata.chats,message];
                            rdata.chats = [...rdata.chats,message];
                    
                            let res = await axios.patch("http://localhost:5000/PrivateChat/"+senderChat.id,sdata);
                            res = await axios.patch("http://localhost:5000/PrivateChat/"+receiverChat.id,rdata);
                            setFile(null);
                            dispatch(chatAction())
                            setSendingStatus("");
                            setDisabledButton(false);
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


    return (
    <div className={receiver.role == "Student"?style.studentChatDisplay:receiver.role == "Teacher"?style.teacherChatDisplay:style.aluminiChatDisplay}>
        <div className={style.header} >
            <div className={style.profile} onClick={()=>show()}>
                <img className={style.profilepic} src={receiver.photoUrl} alt="profile pic"/>
                <div>
                    <h1 className={style.name}>{receiver.FullName}</h1>
                    <div className={style.role}>
                        <div className={receiver.role == "Student"?style.studentIndicator:receiver.role == "Teacher"?style.teacherIndicator:style.aluminiIndicator}></div>
                        <h2 className={style.role}> {receiver.role} </h2>
                    </div>
                </div>
            </div>
            <img className={style.menu} src="/Images/menu icon.png" alt="menu" onClick={()=>handleClear()}/>
        </div> 
        <div className={style.mda}>
            {senderChat.chats.map((m)=><MessageBox message={m} delete={handleDelete}/>)}
        </div>  
        <div className={style.typingArea}>
            <label for="select"><img className={receiver.role == "Student"?style.studentImage:receiver.role == "Teacher"?style.teacherImage:receiver.role == "Alumini"&&style.aluminiImage} src="/Images/image.png" alt="image"/></label>
            <input type="file" accept = "image/png, image/jpeg, image/jpg" name="select" id="select" className={style.select} onChange={(e)=>setFile(e.target.files[0])}/>
            <input className={style.input} type="text" id="text" name="text" placeholder='Type Here...' value={text} onChange={(e)=>{setText(e.target.value)}}/>
            <span className={receiver.role == "Student"?style.studentSendBack:receiver.role == "Teacher"?style.teacherSendBack:style.aluminiSendBack}><img className={style.send} src="/Images/send icon.png" alt="send icon" onClick={()=>handleSend()}/><span>{sendingStatus}</span></span>
        </div> 
    </div>
    );
}

export default ChatDisplay;