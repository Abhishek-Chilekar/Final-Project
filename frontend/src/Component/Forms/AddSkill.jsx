import React from "react";
import style from "./addskill.module.css";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { profiles } from "../../Actions/thirdScreenAction";
const AddSkill = ({popupstate,reload}) => {
    let skills = [];
    const user = JSON.parse(localStorage.getItem("User"));
    const [options,setOptions] = useState(skills);
    const [optionValue,setOptionValue] = useState("");
    const [disabled,setDisabled] = useState(false);
    const [status,setStatus] = useState("Add Skill");
    const dispatch = useDispatch();

    const insert = () => {
        setOptions([...options,optionValue]);
    }

    const remove = (index) => {
        if(!disabled){
            setOptions(options.filter((data,i) => {
                return index !== i;
            }));
        }
    }
    const submit = async() => {
        setDisabled(true);
        setStatus("Adding Skills")
        user.skillset = [...user.skillset,...options];
        try{
            const res = await axios.patch("http://localhost:5000/UserDetails/"+user.id,user);
            console.log(res);
            if(res.data.msg == "data updated"){
                localStorage.setItem("User",JSON.stringify(user));
                reload();
            }
            setDisabled(false);
            dispatch(profiles(user));
            popupstate(false);
        }
        catch(e){
            setStatus(e.message);
            setDisabled(false);
        }
    }
    return <div className={style.overlay}>
    <div className={style.popup}>
    <button onClick={() => popupstate(false)} className={style.close}>&times;</button>
    <div className={style.header}>
            <img className={style.image} src="images/S.png" alt="poll" />
            <h2>Add Skills</h2>
    </div>
        <div className={style.outerdiv}>

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
                <span onClick={()=>remove(i)}className={style.cross}>x</span></div>})}
            </div>
            <button className={style.butto} type="button" onClick={submit} disabled={disabled}>{status}</button>
        </div>
    </div>
</div>
}

export default AddSkill;