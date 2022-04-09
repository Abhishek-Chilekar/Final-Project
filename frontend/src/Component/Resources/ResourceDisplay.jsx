import React from 'react';
import style from './ResourceDisplay.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../Actions/userAction';
import axios from 'axios';

const ResoureDisplay = ({ content }) => {

    const user = JSON.parse(localStorage.getItem("User"));
    const dispatch = useDispatch();

    const handleDownload = () => {
        axios({
            //The link 
            url: `http://localhost:5000/Storage/documents/${content.url}`,
            method: "GET",
            responseType: "blob"
        }).then((res) => {
            const fileDownload = require('js-file-download');
            //Give the Requested File name here
            fileDownload(res.data, `${content.url}`);
        }).catch(err => {
            console.log(err);
        });
    }

    const handleBookmark = async () => {

        user.myDoc.includes(content.id) ? console.log("Already Bookmarked") : user.myDoc = [...user.myDoc, content.id];

        try {
            console.log(user);
            const res = await axios.patch("http://localhost:5000/UserDetails/" + user.id, user);
            // localStorage.setItem("User",user);
            // dispatch(login(user));
            console.log(res.data.msg);
        }
        catch (e) {
            console.log(e.message)
        }

    }
    const current = content
    return (
        <div className={style.ResourceDisplay}>
            <div className={style.resourceHeader}>
                <img className={style.image} src={current.type == "pdf" ? "/Images/" + current.type + "Big.png" : "/Images/" + current.type + ".png"} alt="resource type" />
                <h1 className={style.title}> {current.resourceName} </h1>
                {/* <span className={style.bookmark}><img classname={style.icon} src="/Images/bookmark.png" alt="bookmark icon"/></span> */}
            </div>
            <div className={style.data}>
                <h3 className={style.label}> Name :  </h3>
                <p className={style.value}> {current.resourceName} </p>
                <h3 className={style.label}> Uploaded By :  </h3>
                <p className={style.value}> {current.owner.senderName} </p>
                <h3 className={style.label}> Uploaded on :  </h3>
                <p className={style.value}> {current.timeline} </p>
                <h3 className={style.label}> Size :  </h3>
                <p className={style.value}> {current.size} </p>
                <h3 className={style.label}> Description :  </h3>
                <p className={style.value}> {current.description} </p>
                <div className={style.buttonContainer}>
                    {(!user.myDoc.includes(content.id)) && <button className={style.button} onClick={() => handleBookmark()}> Bookmark </button>}
                    <button className={style.button} onClick={() => handleDownload()}> Download </button>
                </div>
            </div>

        </div>);
}

export default ResoureDisplay;