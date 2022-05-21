import axios from 'axios';
import React from 'react';
import style from './poll.module.css';

const Poll = (props)=>{
    const obj = props.groupDetails.poll.filter((p)=>{return p.pollId == props.id})[0];
    const user = JSON.parse(localStorage.getItem("User"));
    const [voted,setVoted] = React.useState(false);
    const [reload,setReload] = React.useState(false);

    React.useEffect(()=>{
        obj.user.includes(user.id)?setVoted(true):setVoted(false);
    },[obj,reload])

    const handleOnChange = async(option)=>{
        option.percentage = (parseInt(option.percentage)+1).toString();
        console.log(option.percentage);

        props.groupDetails.poll = props.groupDetails.poll.map((p)=>{
           if(p.pollId == props.id){
               p.options = p.options.map((o)=>{
                   if(o.name == option.name){
                       return option;
                   }
                   else{
                       return o;
                   }
               });
               p.user = [...p.user,user.id];
           }
           return p;
        })

        console.log(props.groupDetails)

        try{
            let res = await axios.patch("http://localhost:5000/GroupChat/"+props.groupDetails.id,props.groupDetails);
            console.log(res);
            setReload(!reload);
        }
        catch(e){
            console.log(e);
        }
    }

    console.log(obj)
    return <div className={style.pollContainer}>
        <h2>{obj.question}</h2>
        {obj.options.map((o)=>(
            <div className={voted?style.optionContainer1:style.optionContainer}>
                <label className={style.text}>{o.name}</label>
                {!voted&&<input type="radio" name="ans" value={o.name} onChange={()=>handleOnChange(o)}/>}
                {voted&&<div className={style.perContainer}><div className={style.percentText}>{((parseInt(o.percentage))/props.groupDetails.member.length)*100}%</div><progress className={style.pro} value={((parseInt(o.percentage))/props.groupDetails.member.length)*100} max="100" name="progress"/></div>}
            </div>
        ))}
    </div>
}

export default Poll;