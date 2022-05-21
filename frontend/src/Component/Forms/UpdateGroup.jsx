import React, { useState } from "react";
import style from './popup.module.css';
import {useForm} from 'react-hook-form';
import axios from "axios";
import {storage} from '../firebaseConfig';
import {ref,uploadBytesResumable,getDownloadURL} from "@firebase/storage";
import { useDispatch } from "react-redux";
import { group_profiles } from "../../Actions/thirdScreenAction";

const UpdateGroup = ({popupstate,reload,content}) =>{

    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("User"));
    const [success,setSuccess] = useState("");
    const [error,setError] = useState("");
    const [file,setFile] = useState(null);
    const {register,handleSubmit,formState:{errors}} = useForm({
        defaultValues:{
            name:content.groupName,
            description:content.groupDescription
        }
    });
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
                const storageRef = ref(storage,"/GroupProfile/"+data.name+""+file.name);
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
                                member:content.member,
                                chat:content.chat,
                                poll:content.poll,
                                requests:content.requests
                            }
                            const res = await axios.patch("http://localhost:5000/GroupChat/"+content.id,group);
                            if(res.data.msg === "Group Already Exists")
                            {
                                console.log("Group Already Exists");
                                setError("Group Already Exists");
                                return;
                            }
                            console.log(res);
                            setSuccess("Group Updated");
                            reload();
                            dispatch(group_profiles(group));
                            popupstate(false);
                        })
                    }
                    catch(err)
                    {
                        setError(err.message);
                        setDisabled(false);
                    }
                });
            }
            catch(err)
            {
                setError("Error "+err.message);
                setDisabled(false);
            }
        }
        else{
            try{
                const group={
                    groupName:data.name,
                    groupDescription:data.description,
                    photoUrl:content.photoUrl,
                    member:content.member,
                    chat:content.chat,
                    poll:content.poll,
                    requests:content.requests
                }
                const res = await axios.patch("http://localhost:5000/GroupChat/"+content.id,group);
                if(res.data.msg === "Group Already Exists")
                {
                    console.log("Group Already Exists");
                    setError("Group Already Exists");
                    return;
                }
                setSuccess("Group Updated")
                reload();
                dispatch(group_profiles(group));
                popupstate(false);
            }
            catch(e){
                setError("Error "+e.message);
                setDisabled(false);
            }
        }
    }

    return (

        <div className={style.overlay}>

        <div className={style.popup}>
            <div className={style.header}>
                <button onClick={() => popupstate(false)} className={style.close}>&times;</button>
                <img className={style.img} src={file?URL.createObjectURL(file):content.photoUrl} alt="Event" />
                <label className={style.edit} for="file"><img src="/Images/edit icon.png" alt="edit" /></label>
                <input type="file" accept = "image/png, image/jpeg, image/jpg" name="file" id="file" className={style.file} onChange={(e)=>{setFile(e.target.files[0])}}/>
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
                    
                    <button type="submit" className={style.butto} disabled={disabled}>Add</button>
                </div>
            </form>
            </div>
        </div>
     )
}

export default UpdateGroup;