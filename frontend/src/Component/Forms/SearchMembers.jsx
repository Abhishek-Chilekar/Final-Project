import axios from "axios";
import React from "react";
import style from "./searchmembers.module.css";
const SearchMembers = ({popupstate,groupDetails}) => {
    const skills = ["Java","Python","C","C++"];
    const profession = ["Software Engineer","Web Developer","Data Analyst"];
    const [users,setUsers] = React.useState([]);
    const [reload,setReload] = React.useState(false);
    const [search,setSearch] = React.useState({
        role:"All",
        skill:"All",
        profession:"All",
        year:"All",
        branch:"All",
        name:""
    });

    const checkMembers = (id)=>{
        const res = groupDetails.member.filter((m)=>{return m.senderId == id});
        if(res.length == 0){
            return true;
        }
        else{
            return false;
        }
    }

    const handleClick =async(user)=>{
        groupDetails.member = [...groupDetails.member,{
            senderId:user.id,
            isAdmin:"false",
            role:user.role,
        }];
        let res = await axios.patch("http://localhost:5000/GroupChat/"+groupDetails.id,groupDetails);
        console.log(res);

        if(res.data.msg && res.data.msg == "Group Details Updated"){
            user.groupId = [...user.groupId,groupDetails.id];
            res = await axios.patch("http://localhost:5000/UserDetails/"+user.id,user);
            console.log(res);
        }
    }

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
            case "search":
                setSearch({...search,name:target.value});
                break;
            default:
                setSearch(search);
        }
    }
    const currentUser = JSON.parse(localStorage.getItem("User"));

    const getUsers=async()=>{
        const res = await axios.get("http://localhost:5000/UserDetails");
        const user = res.data.filter((u)=>{return currentUser.id != u.id});
        setUsers(user);
    }
    React.useEffect(()=>{},[reload]);
    React.useEffect(()=>{
        getUsers();
    },[]);
    return <div className={style.overlay}>
        <div className={style.popup}>
        <button onClick={() => popupstate(false)} className={style.close}>&times;</button>
        <div className={style.header}>
            <img className={style.image} src="images/A.png" alt="A" />
            <h2>Add Members</h2>
        </div>
            <div className={style.outerdiv}>
                <input className={style.inp} placeholder = "Search" type="text" name="search" id="search" onChange={(e)=>handleOnChange(e.target)} />
                <img className={style.searchImg} src="images/Search Icon.png" alt="Search" />
            </div>
            <div className={style.optionsDiv}>
                <select className={style.options} name="role" id="role" onChange={(e)=>handleOnChange(e.target)}>
                    <option value="All">Role</option>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Alumni">Alumni</option>
                </select>

                <select className={style.options} name="skill" id="skill" onChange={(e)=>handleOnChange(e.target)}>
                    <option value="All">Skills</option>
                    {skills.map((skill) => {return <><option value={skill}>{skill}</option></>})}
                </select>

                <select className={style.options} name="profession" id="profession" onChange={(e)=>handleOnChange(e.target)}>
                    <option value="All">Profession</option>
                    {profession.map((profession) => {return <><option value={profession}>{profession}</option></>})}
                </select>

                <select className={style.options} name="year" id="year" onChange={(e)=>handleOnChange(e.target)}>
                    <option value="All">Year</option>
                    <option value="1">1st</option>
                    <option value="2">2nd</option>
                    <option value="3">3rd</option>
                    <option value="4">4th</option>
                </select>

                <select className={style.options} name='branch' id="branch" onChange={(e)=>handleOnChange(e.target)}>
                    <option value="All">Branch</option>
                    <option value="computer">Computer</option>
                    <option value="mechanical">Mechanical</option>
                    <option value="electrical">Electrical</option>
                    <option value="electronics">Electronics</option>
                    <option value="civil">Civil</option>
                    <option value="ENTC">ENTC</option>
                </select>

            </div>
            <div className={style.members}>
                {users.map((user) => 
                    ((search.name==""||(user.FullName+"").includes(search.name))
                    &&(search.role == "All"||user.role == search.role)
                    &&(search.skill == "All"||user.skillset.includes(search.skill))
                    &&(search.profession == "All"||user.role != "alumini"||user.profession == search.profession)
                    &&(search.year == "All"||user.year == search.year)&&(search.branch == "All"||user.branch == search.branch))&&(<>
                        <div className={style.container}>
                            <div className={style.innercontainer}>
                            <img className={style.profileImg} src={user.photoUrl} alt="Profile" />
                            <div className={style.username}>
                                <h1 className={style.Name}>{user.FullName}</h1>
                                <div className={style.role}>
                                    <div className={(user.role === "Student") ? style.student : (user.role === "Teacher") ? style.teacher: style.alumni}></div>
                                    <span className={style.roleName}>{user.role}</span>
                                </div>
                            </div>
                            </div>
                            {(checkMembers(user.id))&&<button className={style.butto} onClick={()=>handleClick(user)}>Add</button>}
                        </div>
                    </>)
                )}

            </div>
        </div>
    </div>
}

export default SearchMembers;