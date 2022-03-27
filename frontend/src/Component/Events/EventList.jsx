import React,{useState,useEffect} from 'react';
import Event from './Event';
import Rstyle from '../Resources/ResourceList.module.css';
import axios from 'axios';
 /*
    [{
        eventId :
        eventName:
        owner:{senderId: , role:}
        till:
        from:
        description:
        image:
        registeredUser:[userId]
    }]
    */ 
const EventList = () =>{
    let [list,setList] = useState([]);

    useEffect(() => {
       const fetchData = async()=>{
        try{
            const contentList = await axios.get("http://localhost:5000/Events");
            console.log(contentList.data);
            setList(contentList.data);
         }
         catch(e){
             console.log(e.message);
         }
       }
       fetchData();
    }, [])
    return(<div className={Rstyle.resourceList}>{list.map((c)=><Event content={c}/>)}</div>)
}

export default React.memo(EventList);