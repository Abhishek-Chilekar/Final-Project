import React, { useState } from 'react';
import style from './Signup.module.css';
import loginStyle from '../Login/Login.module.css';
import { useForm } from 'react-hook-form';
import {auth,db} from '../firebaseConfig';
import { createUserWithEmailAndPassword,sendEmailVerification } from 'firebase/auth'; 
import { collection, query, where, getDocs } from "firebase/firestore";
import axios from 'axios';
import { Link } from 'react-router-dom';

const Signup = ()=>{
    const [student,setStudent] = useState(true);
    const [alumini,setAlumini] = useState(false);
    const [teacher,setTeacher] = useState(false);
    const [error,setError] = useState("");
    const [success,setSuccess] = useState("");

    const {register,handleSubmit,formState:{errors}} = useForm();
    const url = "http://localhost:5000";

    const handleOnClick = (role) => {
        switch(role){
            case 0:
                setStudent(true);
                setAlumini(false);
                setTeacher(false);
                break;
            case 1:
                setStudent(false);
                setAlumini(false);
                setTeacher(true);
                break;
            case 2:
                setStudent(false);
                setAlumini(true);
                setTeacher(false);
                break;
        }
    }
    return(
        <div className={loginStyle.login}>
            <div className={style.signup}>

                <img className={style.signupImage} src="Images/Login_Art.png" alt="Login" />

                <div className={style.Content}>
                    <span className={style.title}>SIGN <span className={style.titleBlue}>UP</span></span>
                    <span className={loginStyle.error}> {error != "" ? error :errors.name ? errors.name.message : errors.prn?errors.prn.message:(teacher && errors.qualification)?errors.qualification.message:(alumini && errors.org)?errors.org.message:errors.year?errors.year.message:errors.jobRole?errors.jobRole.message:errors.email?errors.email.message:errors.password?errors.password.message:errors.cpassword?.message} </span>
                    <span className={style.success}> {success != "" && success} </span>
                    <form  onSubmit={handleSubmit(async (data) => {
                       try{
                            setSuccess("");
                            data.role = student?"Student": teacher?"Teacher":alumini&&"Alumini";
                            const studentRef = collection(db, data.role);
                            const q = query(studentRef, where("prn", "==", data.prn));
                            const querySnapshot = await getDocs(q);
                            console.log(querySnapshot.size)
                            if(querySnapshot.size == 0){
                                setError("prn not found, please contact your college");
                            }
                            else if(data.password == data.cpassword){
                                setError("");
                               // console.log(data);
                                const userCred = await createUserWithEmailAndPassword(auth,data.email,data.password);
                               // console.log(userCred);
                                await sendEmailVerification(userCred.user,{url:"http://localhost:3000/Chat"});
                                delete data.password
                                delete data.cpassword
                                data.id = userCred.user.uid;
                                const s = await axios.post(url+"/UserDetails",data);
                                console.log(s);
                                setSuccess("Your Verification mail is sent !");
                            }
                            else{
                                setError("Password and Confirm Password don't match")
                            }
                       }
                       catch(error){
                           setError(error.message)
                       }
                    })}>
                        <div className={style.signupForm}>
                        <div className={style.section}>
                            <label for="Name" className={loginStyle.label}>Name</label>
                            <input {...register("FullName",{required:"Name is required",pattern:{value:/^([a-zA-Z ]*){2,}$/,message:"Invalid Name"}})} className={teacher ? style.teacherBox :style.box} type="text" id="Name" />
                            <label for="PRN" className={loginStyle.label}>PRN</label>
                            <input {...register("prn",{required:"PRN is required",pattern:{value:/^([0-9]){8}[A-Z]$/,message:"Invalid PRN"}})} className={teacher ? style.teacherBox :style.box} type="text"  id="PRN" />
                           {student && (<span className={style.span}><label for="Branch" className={loginStyle.label}>Branch</label>
                            <select className={style.dropBox}  {...register("branch",{required:"branch is required"})}>
                                <option  value="all">All</option>
                                <option  value="computer">Computer</option>
                                <option  value="information_technology">Information Technology</option>
                                <option  value="mechanical">Mechanical</option>
                                <option  value="electrical">Electrical</option>
                            </select></span>)}
                            {teacher && <span className={style.span}>
                                <label for="qualification" className={loginStyle.label}>Qualification</label>
                                <input {...register("qualification",{required:"Qualification is required",pattern:{value:/^[a-zA-Z .]*$/,message:"Invalid Qualification"}})} className={teacher ? style.teacherBox :style.box} type="text" id="qualification" />
                            </span>}
                            {alumini && <span className={style.span}>
                                <label for="org" className={loginStyle.label}>Organization</label>
                                <input {...register("org",{required:"Organization is required",pattern:{value:/^[a-zA-Z ]*$/,message:"Invalid Organization"}})} className={teacher ? style.teacherBox :style.box} type="text" id="org" />
                            </span>}
                        </div>
                        <div className={style.section}>
                            {student && <span className={style.span}>
                                <label for="Year" className={loginStyle.label}>Year</label>
                                <input {...register("year",{required:"Year is required",pattern:{value:/^[1-4]$/,message:"Invalid Year"}})} className={teacher ? style.teacherBox :style.box} type="text" id="Year" />    
                            </span>}
                            {teacher && <span className={style.span}>
                                <label for="Email" className={loginStyle.label}>Email</label>
                                <input {...register("email",{required:"Email is required",pattern:{value:/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,message:"Enter a valid email id"}})} className={teacher ? style.teacherBox :style.box} type="text" name="" id="Email" />
                            </span>}
                            {alumini && <span className={style.span}>
                                <label for="jobRole" className={loginStyle.label}>Job Role</label>
                                <input {...register("jobRole",{required:"Job Role is required",pattern:{value:/^[a-zA-Z ]*$/,message:"Invalid Job Role"}})} className={teacher ? style.teacherBox :style.box} type="text" id="jobRole" />
                            </span>}
                            <label for="Password" className={loginStyle.label}>Password</label>
                            <input {...register("password",{required:"Password is required",pattern:{value:/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
                                message:"Password must be atleast 8 characters long and should have atleast 3 lower case letter, 2 upper case letter, 2 number and 1 special character"}})} className={teacher ? style.teacherBox :style.box} type="password" id="Password" />
                            <label for="Confirm Password" className={loginStyle.label}>Confirm Password</label>
                            <input {...register("cpassword",{required:"Confirm Password is required",pattern:{value:/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
                        message:"Password must be atleast 8 characters long and should have atleast 3 lower case letter, 2 upper case letter, 2 number and 1 special character"}})} className={teacher ? style.teacherBox :style.box} type="password" id="Confirm Password" />
                        </div>
                        <div className={style.section}>
                            {(student || alumini) && <span className={style.span}><label for="Email" className={loginStyle.label}>Email</label>
                            <input {...register("email",{required:"Email is required",pattern:{value:/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,message:"Enter a valid email id"}})} className={teacher ? style.teacherBox :style.box} type="text" id="Email" /></span>}
                        </div>
                        </div>
                        <div className={style.buttonSet}>
                            <input className={style.submit} type="submit" name="Register"/>
                            <div className={style.linkSet}>
                                <span className={student ? style.activeText : style.link} onClick={()=>{handleOnClick(0)}}>Student</span>
                                <span className={teacher ? style.activeText : style.link} onClick={()=>{handleOnClick(1)}}>Teacher</span>
                                <span className={alumini ? style.activeText : style.link} onClick={()=>{handleOnClick(2)}}>Alumni</span>
                            </div>
                        </div>
                    </form>
                    <Link to="/Login" className={style.text}>Already have an Account?</Link>
                </div>
            </div>
        </div>
    );
} 

export default Signup;