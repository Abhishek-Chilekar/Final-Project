import React, { useState } from "react";
import style from './popup.module.css';
import {useForm} from 'react-hook-form';
import axios from "axios";
import {storage} from '../firebaseConfig';
import {ref,uploadBytesResumable,getDownloadURL} from "@firebase/storage";

const Popup = ({popupstate,reload}) =>{

    const [show,setShow] = useState(false);
    const user = JSON.parse(localStorage.getItem("User"));
    const [success,setSuccess] = useState("");
    const [error,setError] = useState("");
    const [file,setFile] = useState(null);
    const {register,handleSubmit,formState:{errors}} = useForm();
    const [disabled,setDisabled] = useState(false);

    const upload = async (data)=>{
        setDisabled(true);
        if(file){
            const formData = new FormData();
            formData.append('file',file);
            formData.append('user',data.name);
            
            console.log("Here");
            try
            {
                console.log("Ikde 2");
                const storageRef = ref(storage,"/Events/"+file.name);
                console.log(file.name);
            
                const uploadTask = uploadBytesResumable(storageRef,file);
                uploadTask.on("state_changed",(snapshot) => {
                    setSuccess("Image uploading");
                },(err) => {
                    console.log(err.message);
                },() => {
                    try{
                        setSuccess("Image uploaded");
                        getDownloadURL(uploadTask.snapshot.ref).then(async(link)=>{
                            const group={
                                groupName:data.name,
                                groupDescription:data.description,
                                photoUrl:link,
                                member:[{
                                    senderId:user.id,
                                    role:user.role,
                                    isAdmin:"true"
                                }],
                                chat:[],
                                poll:[],
                                requests:[]
                            }
                            const res = await axios.post("http://localhost:5000/GroupChat/",group);
                            if(res.data.msg === "Group Already Exists")
                            {
                                console.log("Group Already Exists");
                                setError("Group Already Exists");
                                return;
                            }
                            console.log(res);
                            const re = await axios.patch("http://localhost:5000/UserDetails/"+user.id,user);
                            console.log(re)
                            if(re.data.msg =="data updated"){
                                localStorage.setItem("User",JSON.stringify(user));
                            }
                            if(data.notify == "yes" && res.data.id){
                                setSuccess("Group created")
                                const notification={
                                    image:group.photoUrl,
                                    purpose:"group",
                                    type:"All",
                                    heading:group.groupName,
                                    content:group.groupDescription,
                                    url:res.data.id,
                                    contentId:res.data.id,
                                    branch:data.branch,
                                    ignoreList:[user.id]
                                }

                                const result = await axios.post("http://localhost:5000/Notification",notification);
                                console.log(result)
                                setSuccess("Notification generated");
                                reload();
                                popupstate(false);
                            }
                            else{
                                setSuccess("Group created");
                                reload();
                                popupstate(false);
                            }

                        })
                    }
                    catch(err)
                    {
                        console.log(err);
                    }
                });
            }
            catch(err)
            {
                console.log("Error "+err);
            }
        }
        else{
            try{
                const group={
                    groupName:data.name,
                    groupDescription:data.description,
                    photoUrl:"/Images/avatardefault.png",
                    member:[{
                        senderId:user.id,
                        role:user.role,
                        isAdmin:true
                    }],
                    chat:[],
                    poll:[],
                    requests:[]
                }
                const res = await axios.post("http://localhost:5000/GroupChat/",group);
                if(res.data.msg === "Group Already Exists")
                {
                    console.log("Group Already Exists");
                    setError("Group Already Exists");
                    return;
                }
                console.log(res);
                user.groupId = [...user.groupId,res.data.id];
                console.log(user);
                const re = await axios.patch("http://localhost:5000/UserDetails/"+user.id,user);
                console.log(re)
                if(re.data.msg =="data updated"){
                    localStorage.setItem("User",JSON.stringify(user));
                }
                if(data.notify == "yes" && res.data.id){
                    setSuccess("Group Created")
                    const notification={
                        image:group.photoUrl,
                        purpose:"group",
                        heading:group.groupName,
                        contentId:res.data.id,
                        type:"All",
                        content:group.groupDescription,
                        url:res.data.id,
                        branch:data.branch
                    }

                    const result = await axios.post("http://localhost:5000/Notification",notification);
                    console.log(result);
                    setSuccess("Notification generated");
                    reload();
                    popupstate(false);
                }
                else{
                    setSuccess("Group Created");
                    reload();
                    popupstate(false);
                }

            }
            catch(e){
                console.log(e.message);
            }
        }
    }

    return (

        <div className={style.overlay}>

        <div className={style.popup}>
            <div className={style.header}>
                <button onClick={() => popupstate(false)} className={style.close}>&times;</button>
                <img className={file?style.img:style.eventImg} src={file?URL.createObjectURL(file):"/Images/G.png"} alt="Event" />
                <label className={style.edit} for="file"><img src="/Images/edit icon.png" alt="edit" /></label>
                <input type="file" name="file" id="file" className={style.file} onChange={(e)=>{setFile(e.target.files[0])}}/>
                <h1>Groups</h1>
            </div>
            <div className={style.message}>
                <span className={style.success}> {success != "" && success} </span>
                <span className={style.error}> {error!=""&& error} </span>
            </div>
            <form className={style.formcont} onSubmit={handleSubmit((data)=>{upload(data)})}>
                <div className={style.content}>
                    
                    <label for="name" className={style.lab}>Group Name:</label>

                    <input {...register("name")} type="text" name="name" id="name" required className={style.inp}/>

                    <label for="description" className={style.lab}>Description</label>

                    <input {...register("description")} type="text" name="description" id="description" required className={style.inp}/>
                    
                    <div className={style.options}>
                    <span className={style.options}>Notify:</span>
                    <input {...register("notify")} type="radio" name="notify" id="yes"  value="yes" onChange={() => setShow(true)} className={style.options} required/>
                    <label for="yes" className={style.options} >Yes</label>
                    <input {...register("notify")} type="radio" name="notify" value = "no" id = "no" onChange={() => setShow(false)} className={style.options} required/>
                    <label for="no" className={style.options}>No</label>
                    </div>
                    {show && <div className={style.select}>
                        <select {...register("branch")} name="branch" id="branch">
                        <option value="All">All Branches</option>
                        <option value="Computer">Computer</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Electronics">Electronics</option>
                        </select>
                        </div>}
                    <button type="submit" className={style.butto} disabled={disabled}>Add</button>
                </div>
            </form>
            </div>
        </div>
     )
}

export default Popup;