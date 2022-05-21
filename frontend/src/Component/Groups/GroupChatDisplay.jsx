import React,{useState} from 'react';
import style from '../Chat/ChatDisplay.module.css';
import gstyle from './GroupChatDisplay.module.css';
import GroupMessageBox from './GroupMessageBox';
import {storage} from '../firebaseConfig';
import {ref,uploadBytesResumable,getDownloadURL,deleteObject} from "@firebase/storage";
import axios from 'axios';
import GroupOptionsList from '../Forms/GroupOptionsList';
import SearchMember from "../Forms/SearchMembers";
import RemoveMembers from '../Forms/RemoveMembers';
import MakeAdmin from '../Forms/MakeAdmin';
import Poll from '../Forms/Poll';
import { useDispatch } from 'react-redux';
import { group_profiles } from '../../Actions/thirdScreenAction';

const GroupChatDisplay = (props)=>{
    const user = JSON.parse(localStorage.getItem("User"));
    const dispatch = useDispatch();
    console.log(props.content.content);
    const reloadList = props.content.reloadList;
    const [text,setText] = useState("");
    const [file,setFile] = useState(null);
    const [click,setClick] = useState(false);
    const [reload,setReload] = useState(false);
    const [admin,setAdmin] = useState("");
    const [add,setAdd] = useState(false);
    const [remove,setRemove] = useState(false);
    const [poll,setPoll] = useState(false);
    const [makeAdmin,setMakeAdmin] = useState(false);
    const [disabled,setDisabled] = useState(false);
    const [disableButton,setDisableButton] = useState(false);
    const [sendingStatus,setSendingStatus] = useState("");
    const [data,setData] = useState({chat:[],member:[]});
    const current = data;

    const date = new Date();

    const getData = async(id)=>{
        const res = await axios.get("http://localhost:5000/GroupChat/"+id);
        console.log(res);
        setData(res.data[0]);
        const adminUser = res.data[0].member.filter((u)=>u.isAdmin == "true");
        setAdmin(adminUser[0].senderId);
    }

    React.useEffect(()=>{
        getData(props.content.content.id);
    },[]);

    React.useEffect(()=>{
        getData(props.content.content.id);
    },[props.content.content])

    React.useEffect(()=>{
        const interval = setInterval(()=>{
            getData(props.content.content.id);
        },500);
        return ()=>clearInterval(interval);
    },[props.content.content]);

    const handleClick=()=>{
        dispatch(group_profiles(current));
    }

    const handleDelete = async(id)=>{
        try{

            if(!disabled){
                console.log(id)
                setDisabled(true);
                console.log(current.chat)
                const message = current.chat.filter((m)=>{return m.messageId == id})[0]
                console.log(message)
                if(message.type == "text"){
                    current.chat = current.chat.filter((m)=>{return m.messageId != id});
                    const res = await axios.patch("http://localhost:5000/GroupChat/"+current.id,current);
                    console.log(res.data.msg);
                    setDisabled(false);
                    reloadList();
                    setReload(!reload);
                }
                else if(message.type =="image"){
                    const storageRef = ref(storage,message.content);
                    await deleteObject(storageRef);
                    current.chat = current.chat.filter((m)=>{return m.messageId != id});
                    const res = await axios.patch("http://localhost:5000/GroupChat/"+current.id,current);
                    console.log(res.data.msg);
                    setDisabled(false);
                    reloadList();
                    setReload(!reload);
                }
                else{
                    current.chat = current.chat.filter((m)=>{return m.messageId != id});
                    current.poll = current.poll.filter((p)=>{return p.pollId != id});
                    const res = await axios.patch("http://localhost:5000/GroupChat/"+current.id,current);
                    console.log(res.data.msg);
                    setDisabled(false);
                    reloadList();
                    setReload(!reload);
                }
            }

        }
        catch(e){
            console.log(e.message)
            setDisabled(false);
        }
    }


    const handleSend = async()=>{
        if(!disableButton){
            setDisableButton(true);
        if(!file){
            //{messageId,senderName,content,timeline}
            setSendingStatus("Sending");
            const message = {
                messageId : current.id+date.toLocaleString(),
                senderId:user.id,
                senderName: user.FullName,
                type:"text",
                imagePath:"",
                content:text,
                timeline:date.toLocaleString()
            }

            current.chat = [...current.chat,message];
            const res = await axios.patch("http://localhost:5000/GroupChat/"+current.id,current);
            console.log(res.data.msg);
            setDisableButton(false);
            setSendingStatus("");
            reloadList();
            setReload(!reload);
            setText("");
        }
        else{
            setSendingStatus("Sending")
            const storageRef = ref(storage,"/GroupChat/"+current.id+"/"+file.name);
            console.log(file.name);
        
            const uploadTask = uploadBytesResumable(storageRef,file);
            uploadTask.on("state_changed",(snapshot) => {
                setSendingStatus("Uploading")
            },(err) => {
                console.log(err.message);
                setDisableButton(false);
            },() => {
                try{
                    setSendingStatus("Uploaded")
                        getDownloadURL(uploadTask.snapshot.ref).then(async(link)=>{
                            const message = {
                                messageId : current.id+date.toLocaleString(),
                                senderId:user.id,
                                senderName: user.FullName,
                                type:"image",
                                imagePath:"/GroupChat/"+current.id+"/"+file.name,
                                content:link,
                                timeline:date.toLocaleString()
                            }
                
                            current.chat = [...current.chat,message];
                            const res = await axios.patch("http://localhost:5000/GroupChat/"+current.id,current);
                            console.log(res.data.msg);
                            setSendingStatus("");
                            setDisableButton(false);
                            reloadList();
                            setReload(!reload);
                            setFile(null);
                        })
                }
                catch(e){
                    console.log(e.message);
                    setDisableButton(false);
                }
            });
        }
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
        <div className={style.studentChatDisplay}>
            <div className={style.header} >
                <div className={style.profile} onClick={()=>handleClick()}>
                    <img className={style.profilepic} src={current.photoUrl} alt="profile pic"/>
                    <div>
                        <h1 className={style.name}>{current.groupName}</h1>
                        <h2 className={gstyle.text}>Click here to view the details</h2>
                    </div>
                </div>
                <img className={style.menu} src="/Images/micon.png" alt="menu" onClick={()=>setClick(!click)}/>
                {click && <GroupOptionsList popupstate={()=>setClick(false)} reload={reloadList} action={click} check = {admin} add={setAdd} remove={setRemove} makeAdmin={setMakeAdmin} poll={setPoll} groupDetails={current}/>}
                
            </div> 
            <div className={style.mda}>
                {current.chat.map((m)=><GroupMessageBox message={m} groupDetails = {current} delete={(id)=>handleDelete(id)}/>)}
            </div>
            {add && <SearchMember popupstate={setAdd} groupDetails = {current}/>}
            {remove && <RemoveMembers popupstate={setRemove} groupDetails={current}/>} 
            {makeAdmin && <MakeAdmin popupstate={setMakeAdmin} groupDetails={current} reload={reloadList}/>} 
            {poll && <Poll  popupstate={setPoll} reload={()=>setReload(!reload)} reloadList = {reloadList} groupDetails={current}/>} 
            <div className={style.typingArea}>
                <label className={style.imageBack} for="select"><img className={style.studentImage} src="/Images/image.png" alt="image"/></label>
                <input type="file" accept = "image/png, image/jpeg, image/jpg" name="select" id="select" className={style.select} onChange={(e)=>setFile(e.target.files[0])}/>
                <input className={style.input} type="text" id="text" name="text" placeholder='Type Here...' value={text} onChange={(e)=>{setFile(null);setText(e.target.value);}}/>
                <span className={style.studentSendBack}><img className={style.send} src="/Images/send icon.png" alt="send icon" onClick={()=>handleSend()}/><span>{sendingStatus}</span></span>
            </div>
        </div>
    );
}

export default GroupChatDisplay;