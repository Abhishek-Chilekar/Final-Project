import React,{useState,useEffect} from 'react';
import Resource from './Resource';
import style from './ResourceList.module.css';
import axios from 'axios';

const ResourceList = ({select,reload,setReload}) =>{
    const user = JSON.parse(localStorage.getItem("User"));
    let [list,setList] = useState([]);

    const fetchData = async()=>{
        try{
            const contentList = await axios.get("http://localhost:5000/Resources");
            console.log(contentList.data);
            setList(contentList.data);
         }
         catch(e){
             console.log(e.message);
         }
    }

    useEffect(() => {
       fetchData();
    }, [])

    useEffect(()=>{
        const interval = setInterval(()=>{fetchData();},300000);
        return ()=>clearInterval(interval);
    },[])

    useEffect(() => {
        fetchData();
     }, [reload])
     console.log(user);
    return(<div className={style.resourceList}>{list.map((c)=>{
        return (select == "All" || select == c.type) && (c.branch == "all" ||c.branch == user.branch) && <Resource content={c} reload={()=>setReload()}/>
    })}</div>)
}

export default ResourceList;