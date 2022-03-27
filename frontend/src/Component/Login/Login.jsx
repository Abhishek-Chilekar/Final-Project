import { Link,useNavigate } from 'react-router-dom';
import {useState,useEffect} from 'react';
import style from './Login.module.css';
import {useForm} from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '../firebaseConfig';
import axios from 'axios';
import {login,logout} from '../../Actions/userAction';
import {useSelector,useDispatch} from 'react-redux';
const Login = ()=>{
    const user = JSON.parse(localStorage.getItem("User"));
   // console.log(JSON.parse(user));
    const navigate = useNavigate();
    useEffect(() => {
        if(user){
            navigate('/Main');
        }
    }, [user])
    const dispatch = useDispatch();
    const {register,handleSubmit,formState:{errors}} = useForm();
    const [error,setError] = useState("");
    return (
        <div className={style.login}> 
        <div className={style.loginForm}>
            <div className={style.Content}>
                <span className={style.title}>SIGN <span className={style.titleBlue}>IN</span></span>
                <span className={style.error}> {error!=""?error:errors.email ? errors.email.message: errors.password?.message  } </span>
                <form className={style.form} onSubmit={handleSubmit((data)=>{
                    signInWithEmailAndPassword(auth,data.email,data.password)
                    .then(async ({user}) =>{
                        if(user.emailVerified){
                            console.log(user.uid);
                            const currUser = await axios.get("http://localhost:5000"+"/UserDetails/"+user.uid);
                            console.log(currUser.data[0]);
                            dispatch(login(currUser.data[0]));
                            localStorage.setItem("User",JSON.stringify(currUser.data[0]));
                            navigate('/Main');
                        }
                        else{
                            setError("Please verify your account");
                        }
                    })
                    .catch((error)=>{console.dir(error);setError(error.message)});
                })}>
                      <label className={style.label} for="email">Email</label>
                     <input {...register("email",{required:"Email is required",pattern:{value:/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,message:"Enter a valid email id"}})} className={style.box} type="text"  id="email" />
                     <label className={style.label} for='password'>Password</label>
                     <input {...register("password",{required:"Password is required",pattern:{value:/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
                     message:"Password must be atleast 8 characters long and should have atleast 3 lower case letter, 2 upper case letter, 2 number and 1 special character"}})} className={style.box} type="password" id="password" />
                     <input type="submit" className={style.submit} name="submit"/>
                     <p className={style.text}>Forgot password?</p>
                     <Link className={style.text} to="/Signup">Don't have an Account ?</Link>
                </form>
            </div>
             <img className={style.loginImage} src="Images/Login_Art.png" alt="Login" />
        </div>
     </div>);
}

export default Login;
