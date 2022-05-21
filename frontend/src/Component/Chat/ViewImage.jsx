import axios from "axios";
import React from "react";
import style from "./viewimage.module.css";
import { storage } from "../firebaseConfig"
const ViewImage = ({popupstate,imagesrc}) => {

    const [zoom,setZoom] = React.useState(false);
    const download = () => {
        
        //const storageRef = storage.ref();
    }

    return <div className={style.overlay}>
        <div className={style.popup}>
            <div className={style.menu}>
                {/* <button className={style.menuButton} onClick = {() => download()}>Download</button> */}
                <button className={style.menuButton} onClick={() => popupstate(false)}>x</button>
            </div>
            <div className={style.imageContainer}>
                <img className = {zoom ? style.imageZoom : style.image} onClick = {event => {setZoom(!zoom)}}  src={imagesrc} alt={"No"} />
            </div>
        </div>
    </div>
}

export default ViewImage;