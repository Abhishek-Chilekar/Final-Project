import React from "react";
import style from "./aboutus.module.css";

const AboutUs = () => {
    return <div className={style.container}>
        <h1 className={style.heading}>College Connect</h1>
        <p className={style.content}>College Connect is an app for college students who can connect and communicate and share resources; thus forming a community to help each other. It will also include the alumni as well as college staff  who can share experience/referral/resources and much more. We will have a common wall open for everybody for discussions/organizing events/polls.
        </p>
        <span className={style.name}>Meet the Team</span>
        <div className={style.credits}>
        <div className={style.name}>
            {/* <img src="/Art/ZombieFace.png" alt="Abhi" /> */}
            <span className={style.titlename}>Abhishek Chilekar</span>
            <span className={style.mail}>abhichileker@gmail.com</span>
        </div>
        <div className={style.name}>
            {/* <img src="/Art/CreeperFace.png" alt="Nik" /> */}
            <span className={style.titlename}>Nikhil Mahajan</span>
            <span className={style.mail}>nikhilgmahajan2005@gmail.com</span>
        </div>
        <div className={style.name}>
            {/* <img src="/Art/PolarBearFace.png" alt="Swarup" /> */}
            <span className={style.titlename}>Swarup Phatangare</span>
            <span className={style.mail}> pahatangareswarup@gmail.com</span>
        </div>
        <div className={style.name}>  
        {/* <img src="/Art/SkeletonFace.png" alt="Akshay" />  */}
            <span className={style.titlename}>Akshay Gidwani</span>
            <span className={style.mail}>akagidwani@gmail.com</span>
        </div>
        </div>
    </div>
}

export default AboutUs;