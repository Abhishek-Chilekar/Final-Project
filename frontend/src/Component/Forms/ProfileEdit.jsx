import React from "react";
import style from './profileedit.module.css';
import {useForm} from 'react-hook-form';
import axios from "axios";
import {storage} from '../firebaseConfig';
import {ref,uploadBytesResumable,getDownloadURL} from "@firebase/storage";

const ProfileEdit = ({popupstate}) => {
    const {register,handleSubmit,formState:{errors}} = useForm();
    const user = JSON.parse(localStorage.getItem("User"));
    const [success,setSuccess] = React.useState("");
    const [error,setError] = React.useState("");
    const [file,setFile] = React.useState(null);


    const update = (data)=>{
        setSuccess("");
        setError("");
        if(!file){
            setError("Click on the edit icon to upload a file");
        }
        else{
            try{
                const storageRef = ref(storage,"/User Profile/"+file.name);
                const uploadTask = uploadBytesResumable(storageRef,file);
                uploadTask.on("state_changed",(snapshot) => {
                    setSuccess("Image uploading");
                },(err) => {
                    console.log(err.message);
                },() => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async(link)=>{
                        setSuccess("Image uploaded");
                        user.FullName = data.name;
                        user.branch = data.branch;
                        user.photoUrl = link;
                        user.year = data.year;
                        const res = await axios.patch("http://localhost:5000/UserDetails/"+user.id,user);
                        console.log(res.data.msg);
                        localStorage.setItem("User",JSON.stringify(user));
                        setSuccess("Profile Updated");
                    })
                })
            }
            catch(e){
                console.log(e.message)
            }
        }
    }

    return <div className={style.overlay}>
    <div className={style.popup}>
    <div className={style.header}>
            <button onClick={() => popupstate(false)} className={style.close}>&times;</button>
            <img className={style.eventImg} src="/Images/E.png" alt="Event" />
            <label className={style.edit} for="file"><img src="/Images/edit icon.png" alt="edit" /></label>
            <input type="file" name="file" id="file" className={style.file} onChange={(e)=>{setFile(e.target.files[0])}}/>
            <h1>Profile</h1>
    </div>
    <span className={style.success}> {success != "" && success} </span>
    <span className={style.error}> {error!=""&& error} </span>
    <form onSubmit={handleSubmit((data)=>{update(data)})}>
        <div className={style.outerdiv}>
            <div className={style.Name}>
            <label className= {style.lab} for="name">Name:</label>
            <input {...register("name")} className={style.inp} type="text" name="name" id="name" value={user.FullName}required/>
        </div>
            
            <div className={style.optiondiv}>
                <div className={style.yearDiv}>
                <label className={style.branchopt} for="year">Year:</label>
                <input {...register("year")} className={style.innerdivstyle} type="text" name="year" id="year" value={user.year} required/>
                </div>
                <div>
                    <div className={style.branchContainer}>
                <label className={style.branchopt} for="branch">Branch:</label>
                    <select {...register("branch")} className={style.branch} name="branch" id="branch" value={user.branch} required>
                        <option value="computer">Computer</option>
                        <option value="mechanical">Mechanical</option>
                        <option value="information_technology">Information Technology</option>
                        <option value="electrical">Electrical</option>
                        <option value="electronics">Electronics</option>
                    </select>
                    </div>
                </div>
            </div>
            <div className={style.submitbtn}>
            <button className={style.butto} type="submit">Save</button>
            </div>
        </div>
    </form>
    </div>
</div>
}

export default ProfileEdit