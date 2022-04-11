import { Link } from 'react-router-dom';
import style from './Login.module.css';
import {useForm} from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '../firebaseConfig';
const Login = ()=>{
    const {register,handleSubmit,formState:{errors}} = useForm();
    return (
    <div className={style.login}> 
       <div className={style.loginForm}>
           <div className={style.Content}>
               <span className={style.title}>SIGN <span className={style.titleBlue}>IN</span></span>
               
               <form className={style.form} 
               onSubmit={handleSubmit((data)=>{
                   signInWithEmailAndPassword(auth,data.email,data.password)
                   .then((userCredential)=>{console.log(userCredential.user)})
                   .catch((error)=>{console.log(error.message)});
               })}
               >
                    <label className={style.label} for="email">Email</label>
                    <input {...register("email",{required:"Email is required",pattern:{value:/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,message:"Enter a valid email id"}})} className={style.box} type="text"  id="email" />
                    <span className={style.error}>{errors.email?.message}</span>
                    <label className={style.label} for='password'>Password</label>
                    <input {...register("password",{
                        required:"Password is required",
                        pattern:{value:/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
                        message:"Password must be atleast 8 characters long and should have atleast 3 lower case letter, 2 upper case letter, 2 number and 1 special character"}})} 
                    className={style.box} type="password" id="password" />
                    <span className={style.error}>{errors.password ? "?":""}</span>
                    <input type="submit" className={style.submit} name="submit" value="Login"/>
                    <p className={style.text}>Forgot password?</p>
                    <Link className={style.text} to="/Signup">Don't have an Account ?</Link>
               </form>
           </div>
            <img className={style.loginImage} src="Images/Login_Art.png" alt="Login" />
       </div>
    </div>);
}

export default Login;
