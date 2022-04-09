import React, { useEffect, useState } from "react";
import style from "./poll.module.css";
import {useForm} from 'react-hook-form';
import axios from "axios";

const Poll = ({popupstate,groupDetails,reload,reloadList}) => {
    const [options,setOptions] = useState([]);
    const [optionValue,setOptionValue] = useState("");
    const [disabled,setDisabled] = useState("");
    const {register,handleSubmit,formState:{errors}} = useForm();
    const user = JSON.parse(localStorage.getItem("User"));
    const date = new Date();

    const insert = () => {
        setOptions([...options,optionValue]);
        console.log(options);
    }

    const savePoll=async(data)=>{
        setDisabled(true);
        const option = options.map((text)=>{return {name:text,percentage:"0"}})
        const obj = {
            pollId:user.id+date.toLocaleString(),
            senderId:user.id,
            senderName:user.FullName,
            question:data.question,
            options:option,
            user:[]
        }

        groupDetails.poll = [...groupDetails.poll,obj];
        groupDetails.chat = [...groupDetails.chat,{
            messageId:obj.pollId,
            type:"poll",
            senderId:user.id,            
            senderName:obj.senderName,
            content:obj.pollId,
            timeline:date.toLocaleString()
        }]

        try{
            const res = await axios.patch("http://localhost:5000/GroupChat/"+groupDetails.id,groupDetails);
            console.log(res);
            setDisabled(false);
            reload();
            reloadList();
            popupstate(false);
        }
        catch(e){
            setDisabled(false);
            console.log(e);
        }
    }

    const remove = (index) => {
       setOptions(options.filter((data,i) => {
           return index !== i;
       }));
    };
    
    useEffect(() => {},[options]);

    return <div className={style.overlay}>
        <div className={style.popup}>
        <button onClick={() => popupstate(false)} className={style.close}>&times;</button>
        <div className={style.header}>
            <img className={style.image} src="images/P.png" alt="poll" />
            <h2>Poll</h2>
        </div>
        <form onSubmit={handleSubmit((data)=>savePoll(data))}>
            <div className={style.form}>
                <div className={style.outerdiv}>
                    <label className={style.lab1} htmlFor="statement">Poll Statement:</label>
                    <input {...register("question")}className={style.inp1} placeholder="Question" required type="text" name="question" id="question"/>
                    <label className={style.optionstxt}>Options:</label>
                    <div className={style.optionsbutton}>
                        <input className={style.opt} type="text" required onChange = {(e) => {setOptionValue(e.target.value)}}/>
                        <div className={style.add} onClick={()=>insert()}>+</div>
                    </div>
                    <div className={style.outeroptionsbutton}>
                            {options.map((text,i) => {return <div className={style.element}>
                                 <div className={style.elementText}>
                                     <span className={style.elementNo}>{(i+1)+". "}</span>
                                     <span className={style.elementName}>{text}</span>
                                 </div>
                                <span onClick={()=>remove()}className={style.cross}>x</span></div>})}
                    </div>
                    <button className={style.butto} type="submit" disabled={disabled}>Start Poll</button>
                </div>
            </div>
        </form>
        </div>
    </div>
}

export default Poll;