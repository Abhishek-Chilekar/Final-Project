import React,{useState} from "react";
import style from "./addevent.module.css";
import {useForm} from 'react-hook-form';
import axios from "axios";
import {storage} from '../firebaseConfig';
import {ref,uploadBytesResumable,getDownloadURL} from "@firebase/storage";
const AddEvent = ({popupstate}) => {

    const {register,handleSubmit,formState:{errors}} = useForm();
    const user = JSON.parse(localStorage.getItem("User"));
    const [success,setSuccess] = useState("");
    const [error,setError] = useState("");
    const [file,setFile] = useState(null);
    let [url,setUrl] = useState("");


    const upload = async (props) => {
        const formData = new FormData();
        formData.append('file',file);
        formData.append('user',props.name);
        
        console.log("Here");
        try
        {
            console.log("Ikde 2");
            const storageRef = ref(storage,"/Events/"+file.name);
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
                            const event = {
                                eventName:props.name,
                                owner:{
                                    senderId:user.id,
                                    role:user.role
                                },
                                till:props.till,
                                from:props.from,
                                url:props.link,
                                description:props.description,
                                branch:props.branch,
                                image:link,
                                registeredUser:[]
                            }
                            const {data} = await axios.post("http://localhost:5000/Events",event);
                            const res = data;
                            if(res.msg == "Event Added"){
                                setSuccess(res.msg);
                                const notification = {
                                    image:event.image,
                                    purpose:"event",
                                    heading:event.eventName,
                                    content:event.description,
                                    url:event.url,
                                    branch:event.branch
                                }
                                console.log(notification);
                                const {data} = await axios.post("http://localhost:5000/Notification",notification);
                                const notiRes = data;
                                if(notiRes.id){
                                    setSuccess("notification generated");
                                }
                                else{
                                    setError(notiRes.msg)
                                }
                            }
                            else{
                                setError(res.msg);
                            }
                    });
                    
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
    return (<div className={style.overlay}>
        <div className={style.popup}>
        <div className={style.header}>
            <button onClick={() => popupstate(false)} className={style.close}>&times;</button>
            <img className={style.eventImg} src="/Images/E.png" alt="Event" />
            <label className={style.edit} for="file"><img src="/Images/edit icon.png" alt="edit" /></label>
            <input type="file" name="file" id="file" className={style.file} onChange={(e)=>{setFile(e.target.files[0])}}/>
            <h1>Events</h1>
        </div>
        <span className={style.success}> {success != "" && success} </span>
        <span className={style.error}> {error!=""&& error} </span>
        <form onSubmit={handleSubmit(async(data)=>{
                            await upload(data);
                        })}>
            <div className={style.outerdiv}>
                <div className={style.leftside}>
                    <label className={style.lab1} for="name" >Name:</label>
                    <input {...register("name")}className={style.inp1} type="text" name="name" id="name" required />

                    <label className={style.lab1} for="from">From</label>
                    <input {...register("from")} className={style.inp1} type="text" name="from" id="from" required/>

                    <label className={style.lab1} for="branch">Branch:</label>
                    <select {...register("branch")}className={style.inp1} name="branch" id="branch" required>
                        <option selected value="all">All</option>
                        <option value="computer">Computer</option>
                        <option value="mechanical">Mechanical</option>
                        <option value="information technology">Information Technology</option>
                        <option value="electrical">Electrical</option>
                        <option value="electronics">Electornics</option>
                    </select>
                </div>
                <div className={style.rightside}>
                    <label className={style.lab1} for="till">Till:</label>
                    <input {...register("till")} className={style.inp1} type="text" name="till" id="till" required/>

                    <label className={style.lab1} for="link">Registration Link:</label>
                    <input {...register("link")} className={style.inp1} type="text" name="link" id="link" required/>

                    <label className={style.lab1} for="description">Description:</label>
                    <input {...register("description")} className={style.inp1} type="text" name="description" id="description" required/>
                </div>
            </div>
            <button className={style.butto} type="submit">Add Event</button>
        </form>
        </div>
    </div>)
}

export default AddEvent;