import React from 'react';
import style from './ErrorDisplay.module.css';
import { useState } from 'react';

const ErrorDisplay = (props) =>{
    const [visibility, setVisibility] = useState(false);
    const handleOnClick = () =>{
        setVisibility(!visibility);
    }
    const message = props.message;
    // return (<h1>abhishek</h1>)
    return (
    <span className={style.help}>
        <img src="Images/help.png" alt="help" className={style.image} onMouseOver={handleOnClick} onMouseOut={handleOnClick}/>
        <div className={visibility ? style.contentVisibility:style.content}>
            <p>{message}</p>
        </div>
    </span>)
}

export default ErrorDisplay;