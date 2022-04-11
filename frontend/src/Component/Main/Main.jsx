import React,{useEffect} from 'react';
import Navigation from './Navigation';
import style from "./Main.module.css";
import MainPanel from './MainPanel';
import ThirdScreen from './ThirdScreen';
import {useSelector,useDispatch} from 'react-redux';
import { updateWindow } from '../../Actions/windowAction';
import { useState } from 'react';
import UploadResource from '../Forms/UploadResource';

const Chat = () =>{
    //localStorage.removeItem("User");
    const Nav = useSelector(state => state.Nav);
    const {width} = useSelector(state => state.UpdateWindow)
    const dispatch = useDispatch();
    let [popup,setPopup] = useState(true);
    const handleResize =()=>{
        dispatch(updateWindow());
    }
    useEffect(() => {
        const r = window.addEventListener('resize',handleResize);
        return window.removeEventListener('resize',r);
    }, [])
    return(
        <div className={style.chat}>
            {width > 1400 && <Navigation/>}
            <MainPanel/>
           {(Nav.active != "Notification" && Nav.active != "About" && width > 1040) && <ThirdScreen/>}
        </div>
    )
}

export default Chat;