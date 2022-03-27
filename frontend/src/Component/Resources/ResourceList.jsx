import React,{useState,useEffect} from 'react';
import Resource from './Resource';
import style from './ResourceList.module.css';
import axios from 'axios';

const ResourceList = ({select}) =>{
    let [list,setList] = useState([]);

    useEffect(() => {
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
       fetchData();
    }, [])

    return(<div className={style.resourceList}>{list.map((c)=>{
        return (select == "All" || select == c.type) && <Resource content={c}/>
    })}</div>)
}

export default ResourceList;