import style from './LandingPage.module.css';
import { Link } from 'react-router-dom';
const LandingPage = ()=>{
    return (
    <div className={style.LandingPage}>
    <div className={style.feature3div}>
        <div className={style.circleouter}>
            <img className = {style.circle1} src="/Images/Ellispe.png" alt="Ellipse"/>
        </div>
      
      {/* <img className = {style.circle2} src="/Images/Ellipse 2.png" alt="Ellipse"/> */}
        <div className={style.hero}>
            <div className={style.Content}>
                <span className={style.heading1}>College</span> 
                <span className={style.heading2}>Connect</span>
                <span className={style.subtitle1}>Connecting bond beyond</span>
                <Link className={style.link} to="/Login"><span className={style.button1} > Join Now </span></Link>
            </div>
            <div className={style.illustration}>
                <img className={style.illustrationImg} src="/Images/illustration.png" alt="illustration"/>
            </div>
        </div>
    </div>        
    </div>
    );
}

export default LandingPage;