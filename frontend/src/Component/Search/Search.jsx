import axios from 'axios';
import React,{useState,useEffect} from 'react';
import style from './Search.module.css';
import {useDispatch} from 'react-redux';
import { chats } from '../../Actions/thirdScreenAction';

const Search = ({getText})=>{
    const name = getText();
    let [search,setSearch] = useState({
        role:"All",
        skill:"All",
        profession:"All",
        year:"All",
        branch:"All",
        name:name,
    });
    useEffect(()=>{
        setSearch({...search,name:name});
    },[name])
    const dispatch = useDispatch();
    const skill = ['html','css','javascript'];
    const profession = ['data analyst','web developer','UI/UX designer']
    let [data,setData] = useState([]);
    const [reload,setReload] = useState(false);
    const [disabled,setDisabled] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem("User"));
    console.log(currentUser);
    const getData = async()=>{
        const res = await axios.get("http://localhost:5000/UserDetails");
        setData(res.data);
    }
    useEffect(()=>{},[reload]);

    const handleOnChange = (target)=>{
        switch(target.name){
            case "role":
                setSearch({...search,role:target.value});
                break;
            case "skill":
                setSearch({...search,skill:target.value});
                break;
            case "profession":
                setSearch({...search,profession:target.value});
                break;
            case "year":
                setSearch({...search,year:target.value});
                break;
            case "branch":
                setSearch({...search,branch:target.value});
                break;
            default:
                setSearch(search);
        }
    }

    const handleClick = async(user)=>{
        setDisabled(true);
        try{
            user.request = [...user.request,{
                requestId:currentUser.id,
                senderId:currentUser.id,
                requestMessage:currentUser.FullName+" is requesting for a permission to contact you ."
            }];
            console.log(user);
            const res = await axios.patch("http://localhost:5000/UserDetails/"+user.id,user);
            console.log(res.data.msg);
            setDisabled(false);
            setReload(!reload);
        }
        catch(e){
            console.log(e.message);
            setDisabled(false);
        }
    }

    const handleMessage=async(user)=>{
        try{
            let obj= {};
            const res = await axios.get("http://localhost:5000/PrivateChat/"+currentUser.id+user.id);
            console.log(res);
            if(res.data.msg){
                const postRes = await axios.post("http://localhost:5000/PrivateChat/"+currentUser.id+user.id,{
                    senderId:currentUser.id,
                    receiverId:user.id,
                    chats:[]
                });
                console.log(postRes.data.msg);
                if(postRes.data.msg == "Document Added"){
                    const postRes = await axios.post("http://localhost:5000/PrivateChat/"+user.id+currentUser.id,{
                        receiverId:currentUser.id,
                        senderId:user.id,
                        chats:[]
                    });
                    console.log(postRes.data.msg);
                }
                obj = {
                    senderChat:{
                        senderId:currentUser.id,
                        receiverId:user.id,
                        chats:[]
                    },
                    receiverChat:{
                        receiverId:currentUser.id,
                        senderId:user.id,
                        chats:[]
                    },
                    receiver:user
                }
            }
            else{
                const receiverChat = await axios.get("http://localhost:5000/PrivateChat/"+user.id+currentUser.id);
                obj = {
                    senderChat:res.data,
                    receiverChat:receiverChat.data,
                    receiver:user
                }
            }
            dispatch(chats(obj))
        }
        catch(e){
            console.log(e.message);
        }
    }

    const checkIfRequestMade = (user)=>{
        const s = user.request.filter((req)=>{
            return req.senderId == currentUser.id;
        })
        if(s.length == 0){
            return true;
        }
        else{
            return false;
        }
    }

    useEffect(()=>{
        getData();
    },[])
    return(<div>
        <div className={style.filter}>
            <select className={style.select} name='role' onChange={(e)=>handleOnChange(e.target)}>
                <option value="All">Role</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Alumini">Alumini</option>
            </select>
            <select className={style.select} name='skill' onChange={(e)=>handleOnChange(e.target)}>
                <option value="All">Skill</option>
                {skill.map((s)=>(<option value={s}>{s}</option>))}
            </select>
            <select className={style.select} name='profession' onChange={(e)=>handleOnChange(e.target)}>
                <option value="All">Profession</option>
                {profession.map((s)=>(<option value={s}>{s}</option>))}
            </select>
            <select className={style.select} name='year' onChange={(e)=>handleOnChange(e.target)}>
                <option value="All">Year</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
            <select className={style.select} name='branch' onChange={(e)=>handleOnChange(e.target)}>
                <option value="All">Branch</option>
                <option value="computer">Computer</option>
                <option value="mechanical">Mechanical</option>
                <option value="electrical">Electrical</option>
                <option value="electronics">Electronics</option>
                <option value="civil">Civil</option>
                <option value="ENTC">ENTC</option>
            </select>
        </div>
        <div>
           {data.map((user)=>(user.id != currentUser.id && (search.name==""||(user.FullName+"").includes(search.name))&&(search.role == "All"||user.role == search.role)&&(search.skill == "All"||user.skillset.includes(search.skill))&&(search.profession == "All"||user.role != "alumini"||user.profession == search.profession)&&(search.year == "All"||user.year == search.year)&&(search.branch == "All"||user.branch == search.branch))&&(
            <div className={style.list}>
                <div className={style.details}>
                    <img className={style.image} src={user.photoUrl?user.photoUrl:"/Images/avatardefault.png"} alt="profilepic"/>
                    <div className={style.inner}>
                        <h1>{user.FullName}</h1>
                        <div className={style.role}>
                            <div className={style.student}></div>
                            <h2 className={style.roleName}>{user.role}</h2>
                        </div>
                        {(user.skillset&&user.skillset.length > 0)&&<div className={style.skillset}>
                            <h2 className={style.skill}>{user.skillset[0]}</h2>
                            {user.skillset.length > 1&&<h2 className={style.skill}>{user.skillset[1]}</h2>}
                        </div>}
                    </div>
                </div>
               {((checkIfRequestMade(user))&&(!user.requestAccepted.includes(currentUser.id)))&&<button className={style.request} disabled={disabled} onClick={()=>handleClick(user)}>Request</button>}
               {((!checkIfRequestMade(user))&&(!user.requestAccepted.includes(currentUser.id)))&&<button className={style.request}>Waiting</button>}
               {user.requestAccepted.includes(currentUser.id)&&<button className={style.request} onClick={()=>handleMessage(user)}>Message</button>}
            </div>
           ))}
        </div>
    </div>)
}

export default Search;
