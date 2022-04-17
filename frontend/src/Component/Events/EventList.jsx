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
    let [outdatedEvents, setOutdatedEvents] = useState([]);

    const deleteOutdatedEvents = async () => {
        outdatedEvents.map(async (event) => {
            await axios.delete("http://localhost:5000/Events/" + event)
        })
    }
    const fetchData = async () => {
        try {
            const contentList = await axios.get("http://localhost:5000/Events");
            let newList = contentList.data;
            newList.filter((e) => {
                let startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                let tillDate = new Date(e.till);

                if (startDate.toISOString() > tillDate.toISOString()) {
                    setOutdatedEvents(...outdatedEvents, e.id);
                    return false;
                }
                else {
                    return true;
                }
            });
            setList(contentList.data);
            deleteOutdatedEvents();
        }
        catch (e) {
            console.log(e.message);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => { fetchData(); }, 300000);
        return () => clearInterval(interval);
    }, [])
    useEffect(() => {
        fetchData();
    }, [reload]);
    return (<div className={Rstyle.resourceList}>{list.map((c) => (c.branch.toLowerCase() == "all" || c.branch.toLowerCase() == user.branch.toLowerCase()) && (c.id !== outdatedEvents.includes(c.id)) && <Event content={c} reload={setReload} />)}</div>)
}

export default React.memo(EventList);