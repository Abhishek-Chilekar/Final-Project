import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { events } from "../../Actions/thirdScreenAction";
import EventItem from "./EventItem";
import style from "./searchevent.module.css";

const SearchEvent = ({ getText }) => {
    let [ownerName, setOwnerName] = useState("");
    const name = getText();
    const dispatch = useDispatch();
    let [search, setSearch] = useState({
        name: ""
    });

    useEffect(() => {
        setSearch({ ...search, name: name });
    }, [name]);

    let [data, setData] = useState([]);

    const getData = async () => {
        const res = await axios.get("http://localhost:5000/Events/");
        setData(res.data);
    }


    useEffect(() => {
        getData();
    }, []);
    return <div>
        {data.map((event) => {
            return (event.eventName.includes(search.name) && <div>
                <EventItem event={event} />
            </div>)
        })}
    </div>
}

export default SearchEvent;