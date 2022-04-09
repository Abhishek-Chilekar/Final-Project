import React,{useState} from "react";
import style from "./uploadresource.module.css";
import {useForm} from 'react-hook-form';
import axios from "axios";
import { reload } from "firebase/auth";

const UploadResource = ({popupstate,reload}) => {
    const {register,handleSubmit,formState:{errors}} = useForm();
    const user = JSON.parse(localStorage.getItem("User"));
    const [success,setSuccess] = useState("");
    const [error,setError] = useState("");
    const [file,setFile] = useState(null);
    const [disabled,setDisabled] = useState(false);

    const upload =async(data)=>{
        setError("");
        setSuccess("");
        setDisabled(true);
        const formData = new FormData();
        formData.append('file',file);
        formData.append('user',data.name);
        console.log("Here");
        try
        {
            console.log("Here 2");
            const res = await axios.post('http://localhost:5000/Storage/documents',formData,{
                headers:{
                    'Content-type':'multipart/form-data'
                }
            });

            const date = new Date();
            const resource = {
                resourceName:data.name,
                description:data.description,
                branch:data.branch,
                type:res.data.fileName.split('.')[1],
                size:(file.size/1024)+" KB",
                url:res.data.fileName,
                timeline:date.toLocaleString(),
                owner:{
                    senderId:user.id,
                    role:user.role
                }
            }

            try{
                const {data} = await axios.post("http://localhost:5000/Resources",resource);
                const res = data;
                console.log(res);
                if(res.msg == "Resource added"){
                    setError("");
                    setSuccess(res.msg);
                    const notification = {
                        image:"/Images/"+resource.type+".png",
                        purpose:"resource",
                        type:"All",
                        heading:resource.resourceName,
                        content:resource.description,
                        contentId:res.id,
                        url:resource.url,
                        branch:resource.branch
                    }
    
                    const {data} = await axios.post("http://localhost:5000/Notification",notification);
                    const notiRes = data;
                    if(notiRes.id){
                        setSuccess("notification generated");
                        reload();
                        popupstate(false);
                    }
                    else{
                        setError(notiRes.msg);
                        setDisabled(false);
                    }
                }
                else{
                    setError(res.msg);
                    setDisabled(false);
                }
            }
            catch(e){
                setError(e.message);
            }
        }
        catch(err)
        {
            console.log("Error "+err);
        }
    }

    return <div className={style.overlay}>
        <div className={style.popup}>
            <div className={style.header}>
            <button onClick={() => popupstate(false)} className={style.close}>&times;</button>
            <img className={style.resourceImg} src="images/R.png" alt="Resources" />
            <h1>Resources</h1>
        </div>
        <span className={style.success}> {success != "" && success} </span>
        <span className={style.error}> {error!=""?error:errors.name?errors.name.message:""} </span>
        <form onSubmit={handleSubmit(async(data)=>{
           await upload(data)
        })}>
            <div className={style.upperdiv}>
                <label className={style.lab1} for="name">Name: </label>
                <input {...register("name",{required:"Name is required",pattern:{value:/^([a-zA-Z]*){2,}$/,message:"Invalid Name"}})} className={style.inp1} type="text" name="name" id="name" required />

                <label className={style.lab1} for="description">Description: </label>
                <input {...register("description")}className={style.desc} type="text" name="description" id="description" required />
            </div>
            <div className={style.lowerdiv}>
               <div className={style.innerdiv}>
                <label className={style.lab2} for="file">Upload File:</label>
                <input className={style.inp2} type="file" name="file" id="file" required onChange={(e)=>setFile(e.target.files[0])}/>
               </div>
               <div className={style.innerdiv}>
                   <label className={style.lab2} for="branch" required>Branch:</label>                   
                   <select {...register("branch")}className={style.inp2} name="branch" id="">
                        <option value="All">All</option>
                        <option value="computer">Computer</option>
                        <option value="mechanical">Mechanical</option>
                        <option value="information_technology">Information Technology</option>
                        <option value="electrical">Electrical</option>
                        <option value="electronics">Electronics</option>
                    </select>
               </div>
            </div>
            <button className = {style.butto}type="submit" disabled={disabled}>Add</button>
        </form>
        </div>
    </div>
}

export default UploadResource;