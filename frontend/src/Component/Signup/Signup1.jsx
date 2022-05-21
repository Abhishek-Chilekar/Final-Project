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
                    <span className={loginStyle.error}> {error != "" ? error :errors.teacherEmail?errors.teacherEmail.message:errors.name ? errors.name.message : (!teacher&&errors.prn)?errors.prn.message:(teacher&&errors.empCode)?errors.empCode.message:(teacher && errors.qualification)?errors.qualification.message:(alumini && errors.org)?errors.org.message:errors.year?(student && errors.year.message):(alumini&&errors.jobRole)?errors.jobRole.message:((student||alumini)&&errors.email)?errors.email.message:errors.password?errors.password.message:errors.cpassword?.message} </span>
                    <span className={style.success}> {success != "" && success} </span>
                    <form  onSubmit={handleSubmit(async (data) => {
                       try{
                            setSuccess("");
                            console.log(data);
                            data.role = student?"Student": teacher?"Teacher":alumini&&"Alumini";
                            const studentRef = collection(db, data.role);
                            let q;
                            if(!teacher){
                                q = query(studentRef, where("prn", "==", data.prn));
                            }
                            else{
                                q = query(studentRef, where("empid", "==", data.empCode));
                            }
                            const querySnapshot = await getDocs(q);
                            console.log(querySnapshot.size)
                            if(querySnapshot.size == 0){
                                if(!teacher){
                                    setError("prn not found, please contact your college");
                                }
                                else{
                                    setError("employee code not found, please contact your college");
                                }
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
                                if(teacher){
                                    data.email = data.teacherEmail;
                                    delete data.teacherEmail;
                                }
                                data.photoUrl = "/Images/avatardefault.png";
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
                        
                        {student?<>
                        <div className={style.signupForm}>
                        <div className={style.section}>
                            <label for="Name" className={loginStyle.label}>Name</label>
                            <input {...register("FullName",{required:"Name is required",pattern:{value:/^([a-zA-Z ]*){2,}$/,message:"Invalid Name"}})} className={teacher ? style.teacherBox :style.box} type="text" id="Name" />
                            <label for="PRN" className={loginStyle.label}>{teacher?"Employee Code":"PRN"}</label>
                            <input {...register("prn",{required:"PRN is required",pattern:{value:/^([0-9]){8}[A-Z]$/,message:"Invalid PRN"}})} className={style.box} type="text"  id="PRN" />
                            {/* {teacher&&<input {...register("empCode",{required:"Employee Code is required"})} className={style.teacherBox} type="text"  id="Emp Code" />} */}
                            <span className={style.span}><label for="Branch" className={loginStyle.label}>Branch</label>
                            <select className={style.dropBox}  {...register("branch",{required:"branch is required"})}>
                                <option  value="computer">Computer</option>
                                <option  value="information_technology">Information Technology</option>
                                <option  value="mechanical">Mechanical</option>
                                <option  value="electrical">Electrical</option>
                                <option value="electronics">Electronics</option>
                            </select></span>
                            {/* {teacher && <span className={style.span}>
                                <label for="qualification" className={loginStyle.label}>Qualification</label>
                                <input {...register("qualification",{required:"Qualification is required",pattern:{value:/^[a-zA-Z .]*$/,message:"Invalid Qualification"}})} className={teacher ? style.teacherBox :style.box} type="text" id="qualification" />
                            </span>} */}
                            {/* {alumini && <span className={style.span}>
                                <label for="org" className={loginStyle.label}>Organization</label>
                                <input {...register("org",{required:"Organization is required",pattern:{value:/^[a-zA-Z ]*$/,message:"Invalid Organization"}})} className={teacher ? style.teacherBox :style.box} type="text" id="org" />
                            </span>} */}
                        </div>
                        <div className={style.section}>
                            <span className={style.span}>
                                <label for="Year" className={loginStyle.label}>Year</label>
                                <input {...register("year",{required:"Year is required",pattern:{value:/^[1-4]$/,message:"Invalid Year"}})} className={teacher ? style.teacherBox :style.box} type="text" id="Year" />    
                            </span>
                            {/* {teacher && <span className={style.span}>
                                <label for="Email" className={loginStyle.label}>Email</label>
                                <input {...register("teacherEmail",{required:"Teacher's Email is required",pattern:{value:/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,message:"Enter a valid email id"}})} className={teacher ? style.teacherBox :style.box} type="text" name="" id="Email" />
                            </span>}
                            {alumini && <span className={style.span}>
                                <label for="jobRole" className={loginStyle.label}>Job Role</label>
                                <input {...register("jobRole",{required:"Job Role is required",pattern:{value:/^[a-zA-Z ]*$/,message:"Invalid Job Role"}})} className={teacher ? style.teacherBox :style.box} type="text" id="jobRole" />
                            </span>} */}
                            <label for="Password" className={loginStyle.label}>Password</label>
                            <input {...register("password",{required:"Password is required",pattern:{value:/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
                                message:"Password must be atleast 8 characters long and should have atleast 3 lower case letter, 2 upper case letter, 2 number and 1 special character"}})} className={teacher ? style.teacherBox :style.box} type="password" id="Password" />
                            <label for="Confirm Password" className={loginStyle.label}>Confirm Password</label>
                            <input {...register("cpassword",{required:"Confirm Password is required",pattern:{value:/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
                        message:"Password must be atleast 8 characters long and should have atleast 3 lower case letter, 2 upper case letter, 2 number and 1 special character"}})} className={teacher ? style.teacherBox :style.box} type="password" id="Confirm Password" />
                        </div>
                        <div className={style.section}>
                            <span className={style.span}><label for="Email" className={loginStyle.label}>Email</label>
                            <input {...register("email",{required:"Email is required",pattern:{value:/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,message:"Enter a valid email id"}})} className={style.box} type="text" id="Email" /></span>
                            {/* {alumini && <span className={style.span}>
                                <label for="Year" className={loginStyle.label}>Passout Year</label>
                                <input {...register("passout_year",{required:"Passout year is required",pattern:{value:/^([0-9]){4}$/,message:"Invalid Year"}})} className={teacher ? style.teacherBox :style.box} type="text" id="Year" />    
                            </span>} */}
                        </div>
                        </div>


                        </>:teacher?<>
                        <div className={style.signupForm}>
                        <div className={style.section}>
                            <label for="Name" className={loginStyle.label}>Name</label>
                            <input {...register("FullName",{required:"Name is required",pattern:{value:/^([a-zA-Z ]*){2,}$/,message:"Invalid Name"}})} className={teacher ? style.teacherBox :style.box} type="text" id="Name" />
                            <label for="Emp Code" className={loginStyle.label}>Employee Code</label>
                            <input {...register("empCode",{required:"Employee Code is required"})} className={style.teacherBox} type="text"  id="Emp Code" />
                            {/* {student && (<span className={style.span}><label for="Branch" className={loginStyle.label}>Branch</label>
                            <select className={style.dropBox}  {...register("branch",{required:"branch is required"})}>
                                <option  value="computer">Computer</option>
                                <option  value="information_technology">Information Technology</option>
                                <option  value="mechanical">Mechanical</option>
                                <option  value="electrical">Electrical</option>
                                <option value="electronics">Electronics</option>
                            </select></span>)} */}
                            <span className={style.span}>
                                <label for="qualification" className={loginStyle.label}>Qualification</label>
                                <input {...register("qualification",{required:"Qualification is required",pattern:{value:/^[a-zA-Z .]*$/,message:"Invalid Qualification"}})} className={teacher ? style.teacherBox :style.box} type="text" id="qualification" />
                            </span>
                            {/* {alumini && <span className={style.span}>
                                <label for="org" className={loginStyle.label}>Organization</label>
                                <input {...register("org",{required:"Organization is required",pattern:{value:/^[a-zA-Z ]*$/,message:"Invalid Organization"}})} className={teacher ? style.teacherBox :style.box} type="text" id="org" />
                            </span>} */}
                        </div>
                        <div className={style.section}>
                            {/* {student && <span className={style.span}>
                                <label for="Year" className={loginStyle.label}>Year</label>
                                <input {...register("year",{required:"Year is required",pattern:{value:/^[1-4]$/,message:"Invalid Year"}})} className={teacher ? style.teacherBox :style.box} type="text" id="Year" />    
                            </span>} */}
                            <span className={style.span}>
                                <label for="Email" className={loginStyle.label}>Email</label>
                                <input {...register("teacherEmail",{required:"Teacher's Email is required",pattern:{value:/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,message:"Enter a valid email id"}})} className={teacher ? style.teacherBox :style.box} type="text" name="" id="Email" />
                            </span>
                            {/* {alumini && <span className={style.span}>
                                <label for="jobRole" className={loginStyle.label}>Job Role</label>
                                <input {...register("jobRole",{required:"Job Role is required",pattern:{value:/^[a-zA-Z ]*$/,message:"Invalid Job Role"}})} className={teacher ? style.teacherBox :style.box} type="text" id="jobRole" />
                            </span>} */}
                            <label for="Password" className={loginStyle.label}>Password</label>
                            <input {...register("password",{required:"Password is required",pattern:{value:/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
                                message:"Password must be atleast 8 characters long and should have atleast 3 lower case letter, 2 upper case letter, 2 number and 1 special character"}})} className={teacher ? style.teacherBox :style.box} type="password" id="Password" />
                            <label for="Confirm Password" className={loginStyle.label}>Confirm Password</label>
                            <input {...register("cpassword",{required:"Confirm Password is required",pattern:{value:/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
                        message:"Password must be atleast 8 characters long and should have atleast 3 lower case letter, 2 upper case letter, 2 number and 1 special character"}})} className={teacher ? style.teacherBox :style.box} type="password" id="Confirm Password" />
                        </div>
                        {/* <div className={style.section}>
                            {(student || alumini) && <span className={style.span}><label for="Email" className={loginStyle.label}>Email</label>
                            <input {...register("email",{required:"Email is required",pattern:{value:/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,message:"Enter a valid email id"}})} className={teacher ? style.teacherBox :style.box} type="text" id="Email" /></span>}
                            {alumini && <span className={style.span}>
                                <label for="Year" className={loginStyle.label}>Passout Year</label>
                                <input {...register("passout_year",{required:"Passout year is required",pattern:{value:/^([0-9]){4}$/,message:"Invalid Year"}})} className={teacher ? style.teacherBox :style.box} type="text" id="Year" />    
                            </span>}
                        </div> */}
                        </div>


                        </>:<>
                        <div className={style.signupForm}>
                        <div className={style.section}>
                            <label for="Name" className={loginStyle.label}>Name</label>
                            <input {...register("FullName",{required:"Name is required",pattern:{value:/^([a-zA-Z ]*){2,}$/,message:"Invalid Name"}})} className={teacher ? style.teacherBox :style.box} type="text" id="Name" />
                            <label for="PRN" className={loginStyle.label}>{teacher?"Employee Code":"PRN"}</label>
                            <input {...register("prn",{required:"PRN is required",pattern:{value:/^([0-9]){8}[A-Z]$/,message:"Invalid PRN"}})} className={style.box} type="text"  id="PRN" />
                            
                            <span className={style.span}>
                                <label for="org" className={loginStyle.label}>Organization</label>
                                <input {...register("org",{required:"Organization is required",pattern:{value:/^[a-zA-Z ]*$/,message:"Invalid Organization"}})} className={teacher ? style.teacherBox :style.box} type="text" id="org" />
                            </span>
                        </div>
                        <div className={style.section}>
                            <span className={style.span}>
                                <label for="jobRole" className={loginStyle.label}>Job Role</label>
                                <input {...register("jobRole",{required:"Job Role is required",pattern:{value:/^[a-zA-Z ]*$/,message:"Invalid Job Role"}})} className={teacher ? style.teacherBox :style.box} type="text" id="jobRole" />
                            </span>
                            <label for="Password" className={loginStyle.label}>Password</label>
                            <input {...register("password",{required:"Password is required",pattern:{value:/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
                                message:"Password must be atleast 8 characters long and should have atleast 3 lower case letter, 2 upper case letter, 2 number and 1 special character"}})} className={teacher ? style.teacherBox :style.box} type="password" id="Password" />
                            <label for="Confirm Password" className={loginStyle.label}>Confirm Password</label>
                            <input {...register("cpassword",{required:"Confirm Password is required",pattern:{value:/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
                        message:"Password must be atleast 8 characters long and should have atleast 3 lower case letter, 2 upper case letter, 2 number and 1 special character"}})} className={teacher ? style.teacherBox :style.box} type="password" id="Confirm Password" />
                        </div>
                        <div className={style.section}>
                            <span className={style.span}><label for="Email" className={loginStyle.label}>Email</label>
                            <input {...register("email",{required:"Email is required",pattern:{value:/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,message:"Enter a valid email id"}})} className={teacher ? style.teacherBox :style.box} type="text" id="Email" /></span>
                            <span className={style.span}>
                                <label for="Year" className={loginStyle.label}>Passout Year</label>
                                <input {...register("passout_year",{required:"Passout year is required",pattern:{value:/^([0-9]){4}$/,message:"Invalid Year"}})} className={teacher ? style.teacherBox :style.box} type="text" id="Year" />    
                            </span>
                        </div>
                        </div>
                        </>}
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

export default Signup1;