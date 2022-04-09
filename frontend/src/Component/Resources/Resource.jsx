import axios from 'axios';
import React,{useState} from 'react';
import { useDispatch } from 'react-redux';
import {resources} from '../../Actions/thirdScreenAction'
import style from './Resource.module.css';

const Resource = ({content}) =>{
    const [name,setName] = useState("");
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("User"));

    const handleOnClick = ()=>{
        dispatch(resources({
            id:content.id,
            resourceName:content.resourceName,
            owner:{
                senderId:content.owner.senderId,
                role:content.owner.role,
                senderName:name
            },
            type:content.type,
            timeline:content.timeline,
            size:content.size,
            description:content.description,
            url:content.url
            
        }))
    }

    const handleDelete = async() =>{
        try{
            const delres = await axios.delete("http://localhost:5000/Storage/documents/"+content.url);
            console.log(delres.data.msg); 
            const res = await axios.delete("http://localhost:5000/Resources/"+content.id);
            console.log(res.data.msg);
        }
        catch(e){
            console.log(e.message);
        }
    }

    const getUserName = async(id) =>{
        const user = await axios.get("http://localhost:5000/UserDetails/"+id);
        setName(user.data[0].FullName)
    }
    getUserName(content.owner.senderId);
    return(
    <div className={style.resourceBox} onClick={()=>handleOnClick()}>
        <div className={style.details}>
            <img className={style.resourceLogo} src={content.type == "pdf" ? "/Images/pdf.png" : content.type == "docx" ? "/Images/docx.png" : content.type == "xlsx" && "/Images/xlsx.png" } alt="type logo"/>
            <div className={style.resourceDetails}>
                <h1 className={style.name}>{content.resourceName}</h1>
                <p className={style.size}>{content.size}</p>
            </div>
        </div>
        {user.id == content.owner.senderId && <img className={style.download} src="/Images/deleteBlack.png" alt="download" onClick={()=>handleDelete()}/>}
    </div>
    );
}

export default Resource;