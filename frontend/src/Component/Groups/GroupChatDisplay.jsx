import React,{useState} from 'react';
import style from '../Chat/ChatDisplay.module.css';
import GroupMessageBox from './GroupMessageBox';
import {storage} from '../firebaseConfig';
import {ref,uploadBytesResumable,getDownloadURL,deleteObject} from "@firebase/storage";
import axios from 'axios';
import GroupOptionsList from '../Forms/GroupOptionsList';
import SearchMember from "../Forms/SearchMembers";
import RemoveMembers from '../Forms/RemoveMembers';
import MakeAdmin from '../Forms/MakeAdmin';
import Poll from '../Forms/Poll';

const GroupChatDisplay = (props)=>{
    const user = JSON.parse(localStorage.getItem("User"));

    const current = props.content;
    const [text,setText] = useState("");
    const [file,setFile] = useState(null);
    const [click,setClick] = useState(false);
    const [reload,setReload] = useState(false);
    const [admin,setAdmin] = useState("");
    const [add,setAdd] = useState(false);
    const [remove,setRemove] = useState(false);
    const [poll,setPoll] = useState(false);
    const [makeAdmin,setMakeAdmin] = useState(false);

    const date = new Date();

    const getAdmin = ()=>{
        const adminUser = current.member.filter((u)=>u.isAdmin == "true");
        console.log(adminUser);
        setAdmin(adminUser[0].senderId);
    }

    React.useEffect(()=>{
        getAdmin();
    },[])

    const handleDelete = async(id)=>{
        console.log(id)
        console.log(current.chat)
        const message = current.chat.filter((m)=>{return m.messageId == id})[0]
        console.log(message)
        if(message.type == "text"){
            current.chat = current.chat.filter((m)=>{return m.messageId != id});
            const res = await axios.patch("http://localhost:5000/GroupChat/"+current.id,current);
            console.log(res.data.msg);
            setReload(!reload);
        }
        else if(message.type =="image"){
            const storageRef = ref(storage,message.content);
            await deleteObject(storageRef);
            current.chat = current.chat.filter((m)=>{return m.messageId != id});
            const res = await axios.patch("http://localhost:5000/GroupChat/"+current.id,current);
            console.log(res.data.msg);
            setReload(!reload);
        }
        else{
            current.chat = current.chat.filter((m)=>{return m.messageId != id});
            current.poll = current.poll.filter((p)=>{return p.pollId != id});
            const res = await axios.patch("http://localhost:5000/GroupChat/"+current.id,current);
            console.log(res.data.msg);
            setReload(!reload);
        }
    }


    const handleSend = async()=>{
        if(!file){
            //{messageId,senderName,content,timeline}
            const message = {
                messageId : current.id+date.toLocaleString(),
                senderId:user.id,
                senderName: user.FullName,
                type:"text",
                content:text,
                timeline:date.toLocaleString()
            }

            current.chat = [...current.chat,message];
            const res = await axios.patch("http://localhost:5000/GroupChat/"+current.id,current);
            console.log(res.data.msg);
            setReload(!reload);
            setText("");
        }
        else{
            const storageRef = ref(storage,"/GroupChat/"+current.id+"/"+file.name);
            console.log(file.name);
        
            const uploadTask = uploadBytesResumable(storageRef,file);
            uploadTask.on("state_changed",(snapshot) => {
                console.log("Image uploading");
            },(err) => {
                console.log(err.message);
            },() => {
                try{
                    console.log("Image uploaded");
                        getDownloadURL(uploadTask.snapshot.ref).then(async(link)=>{
                            const message = {
                                messageId : current.id+date.toLocaleString(),
                                senderId:user.id,
                                senderName: user.FullName,
                                type:"image",
                                content:link,
                                timeline:date.toLocaleString()
                            }
                
                            current.chat = [...current.chat,message];
                            const res = await axios.patch("http://localhost:5000/GroupChat/"+current.id,current);
                            console.log(res.data.msg);
                            setReload(!reload);
                        })
                }
                catch(e){
                    console.log(e.message);
                }
            });
        }
    }
    /*
{
    groupId:
    groupName:
    groupDescription:
    member:[{senderId,role,isAdmin}]
    chat:[{messageId,senderName,content,timeline}]
    poll:[{pollId,senderName,options:[{name,percentage}]}]
    requests:[userid]
}
*/
    return(
        <div className={style.chatDisplay}>
            <div className={style.header}>
                <div className={style.profile}>
                    <img className={style.profilepic} src={current.photoUrl} alt="profile pic"/>
                    <h1 className={style.name}>{current.groupName}</h1>
                </div>
                <img className={style.menu} src="/Images/micon.png" alt="menu" onClick={()=>setClick(!click)}/>
                {click && <GroupOptionsList action={click} check = {admin} add={setAdd} remove={setRemove} makeAdmin={setMakeAdmin} poll={setPoll} groupDetails={current}/>}
                
            </div> 
            <div className={style.mda}>
                {current.chat.map((m)=><GroupMessageBox message={m} groupDetails = {current} delete={(id)=>handleDelete(id)}/>)}
            </div>
            {add && <SearchMember popupstate={setAdd} groupDetails = {current}/>}
            {remove && <RemoveMembers popupstate={setRemove} groupDetails={current}/>} 
            {makeAdmin && <MakeAdmin popupstate={setMakeAdmin} groupDetails={current}/>} 
            {poll && <Poll  popupstate={setPoll} reload={()=>setReload(!reload)} groupDetails={current}/>} 
            <div className={style.typingArea}>
                <label className={style.imageBack} for="select"><img className={style.image} src="/Images/image.png" alt="image"/></label>
                <input type="file" name="select" id="select" className={style.select} onChange={(e)=>setFile(e.target.files[0])}/>
                <input className={style.input} type="text" id="text" name="text" placeholder='Type Here...' value={text} onChange={(e)=>{setFile(null);setText(e.target.value);}}/>
                <span className={style.sendBack}><img className={style.send} src="/Images/send icon.png" alt="send icon" onClick={()=>handleSend()}/></span>
            </div>
        </div>
    );
}

export default GroupChatDisplay;