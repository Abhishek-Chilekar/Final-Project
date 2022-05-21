import { Link } from 'react-router-dom';
import style from './Nav.module.css';
const Nav = ()=>{
    
    return (
    <div className={style.LandingPage}>
      <img className = {style.circle1} src="/Images/Ellispe.png" alt="Ellipse"/>
      {/* <img className = {style.circle2} src="/Images/Ellipse 2.png" alt="Ellipse"/> */}
        <div className={style.hero}>
            <div className={style.Content}>
                <span className={style.heading1}>College</span> 
                <span className={style.heading2}>Connect</span>
                <span className={style.subtitle1}>Connecting bond beyond</span>
                <Link className={style.link} to="/About"><span className={style.button1} > Join Now </span></Link>
            </div>
            <div className={style.illustration}>
                <img className={style.illustrationImg} src="/Images/illustration.png" alt="illustration"/>
            </div>
        </div>
        <div className={style.feature1}>
            <div className={style.imageContainer}>
                <img className={style.featureImage} src="/Images/community.png" alt="community"/>
                <img className= {style.outline} src = "/Images/rectangle2.png" alt="box"/>
            </div>
            <div className={style.featureContent}>
                <span className={style.title}>Build a strong Student Community</span>
                <img src="/Images/underline.png" alt="underline" className={style.underline}/>
                <p className = {style.text}>Connect to other users and communicate with them, share ideas between users. One to One Chat with other user. Chat with multiple users at once via Group Chat. You can take help or guidance from your seniors or teachers and build a strong bond.</p>
            </div>
        </div>
        <img className = {style.circle3} src="/Images/Ellipse 3.png" alt="Ellipse"/>
        <div className={style.feature2}>
            <div className={style.feature2Content}>
                <span className={style.title2}>Provide a central platform for sharing Resources</span>
                <img src="/Images/underline.png" alt="underline" className={style.underline2}/>
                <p className = {style.text2}>You can find useful Resources for your studies which are shared by other users. You can contribute to the community by uploading any useful Resource also.</p>
            </div>
            <div className={style.imageContainer}>
                <img className={style.featureImage2} src="/Images/resource.png" alt="community"/>
                <img className= {style.outline2} src = "/Images/rectangle.png" alt="box"/>
            </div>
        </div>
        <div className={style.feature2}>
            <div className={style.imageContainer}>
                <img className={style.featureImage3} src="/Images/events.png" alt="community"/>
                <img className= {style.outline3} src = "/Images/rectangle2.png" alt="box"/>
            </div>
            <div className={style.featureContent}>
                <span className={style.title3}>Participate in fun Events</span>
                <img src="/Images/underline.png" alt="underline" className={style.underline3}/>
                <p className = {style.text3}>Know the ongoing Events in the Community and participate in those Events. Particpating in Events is a great way to connect others. You can also create your own Event.</p>
            </div>
        </div>
        <img className = {style.circle4} src="/Images/e3.png" alt="Ellipse"/>
        <div className={style.footer}>cvbjk</div>
    </div>
    );
    
}

export default Nav;