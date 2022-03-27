import React, { useState,useEffect } from 'react';
import style from './MainPanel.module.css';
import MessageList from '../Chat/MessageList';
import ResourceList from '../Resources/ResourceList';
import EventList from '../Events/EventList';
import { useSelector,useDispatch } from 'react-redux';
import NotificationList from '../Notification/NotificationList';
import AddEvent from '../Forms/AddEvent';
import UploadResource from '../Forms/UploadResource';
import Search from '../Search/Search';
import { searchAction } from '../../Actions/navActions';

const MainPanel = () =>{
    const Nav = useSelector(state => state.Nav);
    const dispatch = useDispatch();
    let [popup,setPopup] = useState(false);
    let [select,setSelect] = useState("All");

    const handleOnClick=()=>{
        setPopup(!popup);
    }

    const handleOnChange = (e)=>{
        setSelect(e.target.value);
        console.log(e.target.value);
    }

    const handleSearch = ()=>{
        dispatch(searchAction())
    }
    return(
        <div className={(Nav.active == "Notification" || Nav.active == "About")? style.mainLarge:style.main}>
            {(Nav.active == "Events"&&popup)&&<AddEvent popupstate={setPopup}/>}
            {(Nav.active == "Resources"&&popup)&&<UploadResource popupstate={setPopup}/>}
           <div className={style.header}>
               <div>
                   <h1 className={style.title}>{Nav.active}</h1>
                   <div className={style.dropdown}>
                    {Nav.active == "Chats"?<select id="filter" className={style.select}>
                        <option> All </option>
                        <option> Private Chats </option>
                        <option> Group Chats </option>
                        <option> Requests </option>
                    </select>:Nav.active == "Resources"&&<select id="filter" className={style.select} value={select} onChange={(e)=>handleOnChange(e)}>
                        <option value="All"> All </option>
                        <option value="pdf"> PDF </option>
                        <option value="word"> Word </option>
                        <option value="ppt"> PPT </option>
                        <option value="xlsx"> XLSX </option>
                    </select>}
                   </div>
               </div>
               {(Nav.active != 'Notification' && Nav.active != 'About')&&<span className={style.button} onClick={()=>{handleOnClick()}}><span className={style.plus}>+</span>{Nav.active == "Chats"?"Create a Group":Nav.active == "Resources"?"Add a Resource":Nav.active == "Events"&&"Add a Events" }</span>}
            </div>
            {(Nav.active != "Notification" && Nav.active != "About")&&<div className={style.search} onClick={()=>handleSearch()}>
                <input type="text" placeholder="Search...." id="searchbar" className={style.searchBar}/>
                <div className={style.searchIcon}><img src="/Images/Search icon.png" alt="Search" className={style.icon}/></div>
            </div>}
            {(Nav.active == "Chats"?<MessageList />:Nav.active == "Resources"?<ResourceList select={select}/>:Nav.active == "Events"?<EventList/>:Nav.active == "Notification"?<NotificationList />:Nav.active == "Search"&&<Search/>)}
        </div>
    );
}

export default React.memo(MainPanel);