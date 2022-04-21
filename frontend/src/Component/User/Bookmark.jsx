import React,{useState} from 'react';
import style from './Bookmark.module.css';
import axios from 'axios';

const Bookmark = ({id,content,remove}) =>{
    const user = JSON.parse(localStorage.getItem("User"));
    const [doc,setDoc] = useState({});

    const getData =async(id)=>{
        try{
            const res = await axios.get("http://localhost:5000/Resources/"+id);
            res.data.length == 0 ?setDoc(null):setDoc(res.data[0]);
        }
        catch(e){
            console.log(e.message);
        }
    } 
    getData(id);
    const checkData =async()=>{
        if(!doc){
            user.myDoc = user.myDoc.filter((doc)=>{
                return doc != id;
            })

            try{
                const res = await axios.patch("http://localhost:5000/UserDetails/"+user.id,user);
                localStorage.setItem("User",JSON.stringify(user));
                console.log(res.data.msg);
            }
            catch(e){
                console.log(e.message)
            }
        }
    }
    checkData();
    return(
    <div>
       {doc&&<div className={style.outer}>
            <div className={style.document}>
                <img src={"/Images/"+doc.type+".png"} alt="document type"/>
                <h1 className={style.docName}>{doc.resourceName}</h1>
            </div>
            {content.id == user.id && <span className={style.cross} onClick={()=>remove(id)}>x</span>}
        </div>}
    </div>
    )
}

export default Bookmark;