import React from "react";
import style from './navigationbar.module.css';

const NavigationBar = ({popupstate}) => {
    return <div className={style.overlay}>
        <div className={style.popup}>
        <img className={style.backIcon} onClick={() => popupstate(false)}src="images/navigationImages/back.png" alt="back.png" />
            <div className={style.mainContainer}>
                <img className={style.profileImg} src="images/Cross.png" alt="ProfileImg" />

                <div className={style.mainIcons}>
                    <img className={style.icon} src="images/navigationImages/chat.png" alt="Chat" />
                    <img className={style.icon} src="images/navigationImages/resources.png" alt="Resource" />
                    <img className={style.icon} src="images/navigationImages/events.png" alt="Event" />
                    <img className={style.icon} src="images/navigationImages/notification.png" alt="Notification" />
                    <img className={style.icon} src="images/navigationImages/about.png" alt="About" />
                </div>
                
                    <img className={style.logoutCont} src="images/navigationImages/logout icon.png" alt="Logout" />
            </div>
        </div>
    </div>
}

export default NavigationBar;