import React,{useEffect} from 'react';
import style from './ThirdScreen.module.css';
import ChatDisplay from '../Chat/ChatDisplay';
import ResourceDisplay from '../Resources/ResourceDisplay';
import UserProfile from '../User/UserProfile';
import GroupProfile from '../Groups/GroupProfile';
import { useSelector,useDispatch } from 'react-redux';
import EventDisplay from '../Events/EventDisplay';
import GroupChatDisplay from '../Groups/GroupChatDisplay';
import NothingDisplay from '../Nothing/NothingDisplay';
import { updateWindow } from '../../Actions/windowAction';

const ThirdScreen = () =>{
    const selector = useSelector(state => state.ThirdScreen);
    const dispatch = useDispatch();
    return (<div className={style.container}>
        <div className={style.ThirdScreen}>
            <img src={"/Images/arrow-back.png"} className={style.image} onClick={()=>dispatch(updateWindow(false))} />
            {selector.content?(selector.type == "Chats"?<ChatDisplay content={selector.content}/>:selector.type == "Resources"?<ResourceDisplay content ={selector.content}/>:selector.type == "Events"?<EventDisplay content ={selector.content}/>:selector.type=="Profiles"?<UserProfile content ={selector.content}/>:selector.type=="Group_Chats"?<GroupChatDisplay content={selector.content}/>:selector.type =="Group_Profiles"&&<GroupProfile content={selector.content}/>):<NothingDisplay/>}
        </div>
    </div>)
}

export default ThirdScreen;