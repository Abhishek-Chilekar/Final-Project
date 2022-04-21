import React,{useEffect} from 'react';
import Navigation from './Navigation';
import style from "./Main.module.css";
import MainPanel from './MainPanel';
import ThirdScreen from './ThirdScreen';
import {useSelector,useDispatch} from 'react-redux';
import { updateWindow } from '../../Actions/windowAction';
import { useState } from 'react';
import UploadResource from '../Forms/UploadResource';
import { useNavigate } from 'react-router-dom';

const Chat = () =>{
    //localStorage.removeItem("User");
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("User"));
    if(!user){
        navigate("/Login");
    }
    const Nav = useSelector(state => state.Nav);
    const {width,toggle} = useSelector(state => state.UpdateWindow)
    const dispatch = useDispatch();
    let [popup,setPopup] = useState(true);
    const handleResize =()=>{
        dispatch(updateWindow(false));
    }
    useEffect(() => {
        const r = window.addEventListener('resize',handleResize);
        return window.removeEventListener('resize',r);
    }, [])
    return(
        <div className={style.chat}>
            {width > 1400 && <Navigation/>}
            {!toggle && <MainPanel/>}
           {(Nav.active != "Notification" && Nav.active != "About" && (width > 1040 || toggle)) && <ThirdScreen/>}
        </div>
    )
}

export default Chat;