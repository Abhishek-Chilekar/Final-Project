import React,{useEffect,useState} from 'react';
import style from './NothingDisplay.module.css';

const NothingDisplay = () =>{
    const [width,setWidth] = useState(window.innerWidth)
    const handleResize =()=>{
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        const r = window.addEventListener('resize',handleResize);
        return window.removeEventListener('resize',r);
    }, [])
    return (
        <div className={style.NothingDisplay}>
            <h1>{width}</h1>
        </div>
    );
}

export default NothingDisplay;