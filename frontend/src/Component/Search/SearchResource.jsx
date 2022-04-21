import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import style from "./searchresource.module.css";
import ResourceList from "../Resources/ResourceList";
import { useSelector,useDispatch } from "react-redux";
import { resources } from "../../Actions/thirdScreenAction";
import { updateWindow } from "../../Actions/windowAction";

const SearchResource = ({ getText }) => {
    const name = getText();
    const dispatch = useDispatch();
    const {width} = useSelector(state=>state.UpdateWindow);
    let [search, setSearch] = useState({
        type: "All",
        branch: "All",
        name: ""
    });
    let [username,setUsername] = useState("");
    useEffect(() => {
        setSearch({ ...search, name: name });
    }, [name]);

    const currentUser = JSON.parse(localStorage.getItem("User"));
    let [data, setData] = useState([]);

    const getData = async () => {
        const res = await axios.get("http://localhost:5000/Resources/");
        setData(res.data);
    }
    const handleOnChange = (target) => {
        switch (target.name) {
            case "type":
                setSearch({ ...search, type: target.value });
                break;
            case "branch":
                setSearch({ ...search, branch: target.value });
                break;
            default:
                setSearch(search);
        }
    }
    const getUser = async(id) => {
        const res = await axios.get("http://localhost:5000/UserDetails/"+id);
        console.log(res);
        setUsername(res.data[0].FullName);
    }
    const handleOnClick = (resource) => {
        getUser(resource.owner.senderId);
        console.log(username);
        dispatch(resources({
            id: resource.id,
            resourceName: resource.resourceName,
            owner: {
                senderId: resource.owner.senderId,
                role: resource.owner.role,
                senderName: username
            },
            type: resource.type,
            timeline: resource.timeline,
            size: resource.size,
            description: resource.description,
            url: resource.url
        }));
        if(width < 1040){
            dispatch(updateWindow(true));
        }
    }
    useEffect(() => {
        getData();
    }, []);
    return <div>
        <div className={style.filter}>
            <select name="type" id="type" className={style.select} onChange={(e) => handleOnChange(e.target)}>
                <option value="All">Type</option>   
                <option value="pdf">PDF</option>
                <option value="docx">WORD</option>
                <option value="xlsx">XLSX</option>
                <option value="ppt">PPT</option>
            </select>
            <select className={style.select} name="branch" id="branch" onChange={(e) => handleOnChange(e.target)}>
                <option value="All">Branch</option>
                <option value="Computer">Computer</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Electronics">Electronics</option>
            </select>
        </div>
        {data.map((resource) => {
            return ((search.type === resource.type || search.type === "All") && (search.branch === resource.branch || search.branch === "All") && (resource.resourceName.includes(search.name))) && (<div>
                {/* {resource.resourceName} {resource.type} {resource.branch} */}
                <div className={style.list}>
                    <div className={style.details}>
                        <img src={"/Images/"+resource.type+".png"} alt="default" />
                        <div className={style.inner}>
                            <h1 className={style.name}>{resource.resourceName}</h1>
                            <div className={style.role}>
                                <h2>{resource.type}</h2>
                            </div>
                        </div>
                    </div>
                    <button className={style.request} onClick={() => handleOnClick(resource)}>View</button>
                </div>
            </div>)
        })}
    </div>
}

export default SearchResource;