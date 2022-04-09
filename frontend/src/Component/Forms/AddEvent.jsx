import React, { useState } from "react";
import style from "./addevent.module.css";
import { useForm } from 'react-hook-form';
import axios from "axios";
import {storage} from '../firebaseConfig';
import {ref,uploadBytesResumable,getDownloadURL} from "@firebase/storage";
const AddEvent = ({popupstate,reload}) => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const user = JSON.parse(localStorage.getItem("User"));
    const [success,setSuccess] = useState("");
    const [error,setError] = useState("");
    const [file,setFile] = useState(null);
    let [disabled,setDisabled] = useState(false);
    const [startDate,setStartDate] = useState("");

    const validateStartDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        if (newDate.toISOString() < today.toISOString()) {
            setError("Event Start date cannot be before today.");
        }
        else {
            setError("");
            setStartDate(date);
        }
    }
    const validateEndDate = (date) => {
        const newDate = new Date(startDate);
        newDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(0, 0, 0, 0);
        if(startDate === "")
        {
            setError("Please Enter Start Date First");
        }
        else
        {
        if (newDate.toISOString() > endDate.toISOString()) {
            setError("End Date cannot be before Start Date");
        }
        else {
            setError("");
        }}
    }

    const upload = async (props) => {
        setDisabled(true);
        if (file === null) {
            setError("Please upload Event Image from edit button above");
        }
        else {
            setError("");
            const formData = new FormData();
            formData.append('file', file);
            formData.append('user', props.name);

            console.log("Here");
            try {
                console.log("Ikde 2");
                // const res = await axios.post('http://localhost:5000/Storage/images',formData,{
                //     headers:{
                //         'Content-type':'multipart/form-data'
                //     }
                // });
                const storageRef = ref(storage, "/Events/" + file.name);
                console.log(file.name);

                const uploadTask = uploadBytesResumable(storageRef, file);
                // (await uploadTask).state("")
                //event,UploadTask,Error,Complete
                uploadTask.on("state_changed", (snapshot) => {
                    console.log("Image uploading");
                }, (err) => {
                    console.log(err.message);
                }, () => {
                    try {
                        console.log("Image uploaded");
                        getDownloadURL(uploadTask.snapshot.ref).then(async (link) => {
                            const event = {
                                eventName: props.name,
                                owner: {
                                    senderId: user.id,
                                    role: user.role
                                },
                                till: props.till,
                                from: props.from,
                                url: props.link,
                                description: props.description,
                                branch: props.branch,
                                image: link,
                                registeredUser: []
                            }
                            const { data } = await axios.post("http://localhost:5000/Events", event);
                            const res = data;
                            if(res.msg == "Event Added"){
                                setSuccess(res.msg);
                                const notification = {
                                    image:event.image,
                                    purpose:"event",
                                    type:"All",
                                    heading:event.eventName,
                                    content:event.description,
                                    contentId:res.id,
                                    url:event.url,
                                    branch:event.branch
                                }
                                console.log(notification);
                                const {data} = await axios.post("http://localhost:5000/Notification",notification);
                                const notiRes = data;
                                if (notiRes.id) {
                                    setSuccess("notification generated");
                                    reload();
                                    popupstate(false);
                                }
                                else{
                                    setError(notiRes.msg);
                                    setDisabled(false);
                                }
                            }
                            else {
                                setError(res.msg);
                                setDisabled(false);
                            }
                        });

                    }
                    catch (err) {
                        console.log(err);
                    }
                });
            }
            catch (err) {
                console.log("Error " + err);
            }
        }
    }
    return (<div className={style.overlay}>
        <div className={style.popup}>
            <div className={style.header}>
                <button onClick={() => popupstate(false)} className={style.close}>&times;</button>
                <img className={style.eventImg} src="/Images/E.png" alt="Event" />
                <label className={style.edit} for="file"><img src="/Images/edit icon.png" alt="edit" /></label>
                <input required type="file" name="file" id="file" className={style.file} onChange={(e) => { setFile(e.target.files[0]) }} />
                <h1>Events</h1>
            </div>
            <span className={style.success}> {success != "" && success} </span>
            <span className={style.error}> {error != "" ? error : errors.name ? errors.name.message : errors.from ? errors.from.message : errors.till ? errors.till.message : errors.link ? errors.link.message : ""} </span>
            <form onSubmit={handleSubmit(async (data) => {
                await upload(data);
            })}>
                <div className={style.outerdiv}>
                    <div className={style.leftside}>
                        <label className={style.lab1} for="name" >Name:</label>
                        <input {...register("name", { required: "Event Name is required", pattern: { value: /^([a-zA-Z]*){2,}/, message: "Invalid Event Name" } })} className={style.inp1} type="text" name="name" id="name" />

                        <label className={style.lab1} for="from">From</label>
                        <input {...register("from", { required: "Event Start date is required"})} className={style.inp1} type="date" name="from" id="from" onChange={e => validateStartDate(e.target.value)} required />

                        <label className={style.lab1} for="branch">Branch:</label>
                        <select {...register("branch")} className={style.inp1} name="branch" id="branch" required>
                            <option selected value="All">All</option>
                            <option value="computer">Computer</option>
                            <option value="mechanical">Mechanical</option>
                            <option value="information technology">Information Technology</option>
                            <option value="electrical">Electrical</option>
                            <option value="electronics">Electornics</option>
                        </select>
                    </div>
                    <div className={style.rightside}>
                        <label className={style.lab1} for="till">Till:</label>
                        <input {...register("till", { required: "Event End Date is required"})} className={style.inp1} type="date" name="till" id="till" onChange={e => validateEndDate(e.target.value)} required />

                        <label className={style.lab1} for="link">Registration Link:</label>
                        <input {...register("link", { required: "Event Link is required", pattern: { value: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/, message: "Invalid Link" } })} className={style.inp1} type="text" name="link" id="link" required />

                        <label className={style.lab1} for="description">Description:</label>
                        <input {...register("description")} className={style.inp1} type="text" name="description" id="description" required />
                    </div>
                </div>
                <button className={style.butto} type="submit">Add Event</button>
            </form>
        </div>
    </div>)
}

export default AddEvent;