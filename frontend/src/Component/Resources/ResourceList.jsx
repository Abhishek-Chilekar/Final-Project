import React,{useState,useEffect} from 'react';
import Resource from './Resource';
import style from './ResourceList.module.css';
import axios from 'axios';

const ResourceList = ({select,reload}) =>{
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

    return(<div className={style.resourceList}>{list.map((c)=>{
        return (select == "All" || select == c.type) && (c.branch.toLowerCase() == "all" ||c.branch.toLowerCase() == user.branch.toLowerCase()) && <Resource content={c}/>
    })}</div>)
}

export default ResourceList;