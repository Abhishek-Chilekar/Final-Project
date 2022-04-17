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
import Popup from '../Forms/Popup';
import { searchAction,searchActionResource,searchActionEvent } from '../../Actions/navActions';
import SearchResource from '../Search/SearchResource';
import SearchEvent from '../Search/SearchEvent';
import AboutUs from './About/AboutUs';

const MainPanel = () =>{
    const Nav = useSelector(state => state.Nav);
    const dispatch = useDispatch();
    let [popup,setPopup] = useState(false);
    let [select,setSelect] = useState("All");
    let [text,setText] = useState("");
    let [reload,setReload] = useState(false);

    useEffect(()=>{},[reload]);


    let [searchText,setSearchText] = useState("");

    const getText = () => {
        return searchText;
    }
    const handleOnClick=()=>{
        // if(Nav.active === "Resources")
        // {
        //     dispatch(resources({
        //         popupstate:true
        //     }))
        // }
        // else if(Nav.active === "Events")
        // {
        //     dispatch(events);
        // }
        setPopup(!popup);
    }

    const handleOnChange = (e)=>{
        setSelect(e.target.value);
        console.log(e.target.value);
    }

    const handleSearch = ()=>{
        if(Nav.active === "Chats")
        {
            dispatch(searchAction())
        }
        else if(Nav.active === "Resources")
        {
            dispatch(searchActionResource())
        }
        else if(Nav.active === "Events")
        {
            dispatch(searchActionEvent());
        }
    }
    return(
        <div className={(Nav.active == "Notification" || Nav.active == "About")? style.mainLarge:style.main}>
            {(Nav.active == "Events"&&popup)&&<AddEvent popupstate={setPopup} reload={()=>setReload(!reload)}/>}
            {(Nav.active == "Resources"&&popup)&&<UploadResource popupstate={setPopup} reload={()=>setReload(!reload)}/>}
            {(Nav.active == "Chats"&&popup)&&<Popup popupstate={setPopup} reload={()=>setReload(!reload)}/>}
           <div className={style.header}>
               <div>
                   <h1 className={style.title}>{Nav.active}</h1>
                   <div className={style.dropdown}>
                    {Nav.active == "Chats"?<select id="filter" className={style.select} value={select} onChange={(e)=>handleOnChange(e)}>
                        <option value="All"> All </option>
                        <option value="private_chat"> Private Chats </option>
                        <option value="group_chat"> Group Chats </option>
                        <option value="requests"> Requests </option>
                    </select>:Nav.active == "Resources"&&<select id="filter" className={style.select} value={select} onChange={(e)=>handleOnChange(e)}>
                        <option value="All"> All </option>
                        <option value="pdf"> PDF </option>
                        <option value="docx"> Word </option>
                        <option value="ppt"> PPT </option>
                        <option value="xlsx"> XLSX </option>
                    </select>}
                   </div>
               </div>
               {(Nav.active != 'Notification' && Nav.active != 'About'&& Nav.active != "Search Chat" && Nav.active != "Search Resource" && Nav.active != "Search Event")&&<span className={style.button} onClick={()=>{handleOnClick()}}><span className={style.plus}>+</span>{Nav.active == "Chats"?"Create Group":Nav.active == "Resources"?"Add Resource":Nav.active == "Events"&&"Add Events" }</span>}
            </div>
            {(Nav.active != "Notification" && Nav.active != "About")&&<div className={style.search} onClick={()=>handleSearch()}>
                <input type="text" placeholder="Search...." id="searchbar" className={style.searchBar} onChange={e=> { setSearchText(e.target.value)}} />
                <div className={style.searchIcon}><img src="/Images/Search icon.png" alt="Search" className={style.icon}/></div>
            </div>}
            {(Nav.active == "Chats"?<MessageList select={select} reload={reload} setReload={()=>{}}/>:Nav.active == "Resources"?<ResourceList select={select} reload={reload}/>:Nav.active == "Events"?<EventList reload={reload} setReload={()=>{setReload(!reload)}}/>:Nav.active == "Notification"?<NotificationList />:Nav.active == "Search Chat"?<Search getText= {getText}/>:Nav.active === "Search Resource" ? <SearchResource getText={getText}/>:Nav.active == "Search Event" ?<SearchEvent getText={getText}/>:<AboutUs/>)}
        </div>
    );
}

export default React.memo(MainPanel);