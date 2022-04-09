import React, { useState, useEffect } from 'react';
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
const EventList = ({ reload, setReload }) => {
    const user = JSON.parse(localStorage.getItem("User"));
    let [list, setList] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const contentList = await axios.get("http://localhost:5000/Events");
                let newList = contentList.data;
                newList.filter(async (e) => {
                    let startDate = new Date();
                    startDate.setHours(0, 0, 0, 0);
                    let tillDate = new Date(e.till);

                    if (startDate.toISOString() > tillDate.toISOString() || startDate.toISOString() === tillDate.toISOString()) {
                        await axios.delete("http://localhost:5000/Events/" + e.id)
                        return false;
                    }
                    else {
                        return true;
                    }

                });
                console.log(newList);
                setList(contentList.data);
            }
            catch (e) {
                console.log(e.message);
            }
        }
        fetchData();
    }, [reload]);
    return (<div className={Rstyle.resourceList}>{list.map((c) => (c.branch.toLowerCase() == "All".toLowerCase() || c.branch.toLowerCase() == user.branch.toLowerCase()) && <Event content={c} reload={setReload} />)}</div>)
}

export default React.memo(EventList);