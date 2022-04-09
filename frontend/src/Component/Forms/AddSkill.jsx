import React from "react";
import style from "./addskill.module.css";
import { useState } from "react";
import axios from "axios";
const AddSkill = ({popupstate,reload}) => {
    let skills = [];
    const user = JSON.parse(localStorage.getItem("User"));
    const [options,setOptions] = useState(skills);
    const [optionValue,setOptionValue] = useState("");

    const insert = () => {
        setOptions([...options,optionValue]);
    }

    const remove = (index) => {
        setOptions(options.filter((data,i) => {
            return index !== i;
        }));
    }
    const submit = async() => {
        user.skillset = [...user.skillset,...options];
        try{
            const res = await axios.patch("http://localhost:5000/UserDetails/"+user.id,user);
            console.log(res);
            if(res.data.msg == "data updated"){
                localStorage.setItem("User",JSON.stringify(user));
                reload();
            }
        }
        catch(e){
            console.log(e);
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
            <button className={style.butto} type="button" onClick={submit}>Add Skill</button>
        </div>
    </div>
</div>
}

export default AddSkill;