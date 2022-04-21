import React, { useState } from 'react';
import style from './Signup.module.css';
import loginStyle from '../Login/Login.module.css';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, query, where, getDocs } from "firebase/firestore";
import axios from 'axios';
import { Link } from 'react-router-dom';

const Signup = () => {
    const [student, setStudent] = useState(true);
    const [alumini, setAlumini] = useState(false);
    const [teacher, setTeacher] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const defaultStudent = { FullName: "", branch: "", prn: "", year: "", email: "", password: "", cpassword: "" };
    const defaultTeacher = { FullName: "", empCode: "", email: "", qualification: "", password: "", cpassword: "" }
    const defaultAlumini = { FullName: "", prn: "", email: "", jobRole: "", org: "", passout_year: "", password: "", cpassword: "" }
    const [studentData, setStudentData] = useState(defaultStudent);
    const [teacherData, setTeacherData] = useState(defaultTeacher);
    const [aluminiData, setAluminiData] = useState(defaultAlumini);

    const url = "http://localhost:5000";

    const validateStudent = (studentData) => {
        if (studentData.FullName == "") {
            setError("Name is required");
            return false;
        }
        else if(!studentData.FullName.match(/^([a-zA-Z ]*){2,}$/)){
            setError("Invalid value for name");
            return false;
        }
        else if (studentData.branch == "") {
            setError("branch required");
            return false;
        }
        else if (studentData.prn == "") {
            setError("PRN is required");
            return false;
        }
        else if (!studentData.prn.match(/^([0-9]){8}[A-Z]$/)) {
            setError("Invalid PRN");
            return false;
        }
        else if (studentData.year == "") {
            setError("Year is required");
            return false;
        }
        else if (!studentData.year.match(/^[1-4]$/)) {
            setError("Invalid Year");
            return false;
        }
        else if (studentData.email == "") {
            setError("Email is required");
            return false;
        }
        else if (!studentData.email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)) {
            setError("Invalid Email");
            return false;
        }
        else if(studentData.password == "" || studentData.cpassword == "" || !studentData.password.match(/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/) || !studentData.cpassword.match(/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/)){
            setError("Password must be atleast 8 characters long and should have atleast 3 lower case letter, 2 upper case letter, 2 number and 1 special character");
            return false;
        }
        else if(studentData.password != studentData.cpassword){
            setError("Password and Confirm password doesn't match");
            return false;
        }
        else {
            return true;
        }
    }
    const validateTeacher = (teacherData) => {
        if (teacherData.FullName == "") {
            setError("Name is required");
            return false;
        }
        else if(!teacherData.FullName.match(/^([a-zA-Z ]*){2,}$/))
        {
            setError("Invalid value for name");
            return false;
        }
        else if (teacherData.empCode == "") {
            setError("Employee code required");
            return false;
        }
        else if(!teacherData.empCode.match(/^([0-9][0-9]\/[A-Z]\/[0-9][0-9][0-9][0-9]\/[0-9][0-9][0-9][0-9][0-9])$/))
        {
            setError("Invalid Employee Code");
            return false;
        }
        else if (teacherData.email == "") {
            setError("Email is required");
            return false;
        }
        else if (!teacherData.email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)) {
            setError("Invalid Email");
            return false;
        }
        else if (teacherData.qualification == "") {
            setError("Qualification is required");
            return false;
        }
        else if (!teacherData.qualification.match(/^[a-zA-Z .]*$/)) {
            setError("Qualification invalid");
            return false;
        }
        else if (teacherData.password == "" || teacherData.cpassword == "" || !teacherData.password.match(/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/) || !teacherData.cpassword.match(/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/)) {
            setError("Invalid password");
            return false;
        }
        else if (teacherData.password != teacherData.cpassword) {
            return false;
        }
        else {
            return true;
        }
    }
    const validateAlumni = (alumniData) => {
        if (alumniData.FullName == "") {
            setError("Name is required");
            return false;
        }
        else if(!alumniData.FullName.match(/^([a-zA-Z ]*){2,}$/))
        {
            setError("Invalid value for name");
            return false;
        }
        else if (alumniData.prn == "") {
            setError("PRN is required");
            return false;
        }
        else if (!alumniData.prn.match(/^([0-9]){8}[A-Z]$/)) {
            setError("Invalid PRN");
            return false;
        }
        else if (alumniData.email == "") {
            setError("Email is required");
            return false;
        }
        else if (!alumniData.email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)) {
            setError("Invalid Email");
            return false;
        }
        else if (alumniData.jobRole == "") {
            setError("Job Role is required");
            return false;
        }
        else if (!alumniData.jobRole.match(/^[a-zA-Z ]*$/)) {
            setError("invalid Job Role");
            return false;
        }
        else if (alumniData.org == "") {
            setError("Organization is required");
            return false;
        }
        else if (!alumniData.org.match(/^[a-zA-Z ]*$/)) {
            setError("Invalid Organization");
            return false;
        }
        else if (alumniData.passout_year == "") {
            setError("Passout Year required");
            return false;
        }
        else if (!alumniData.passout_year.match(/^([0-9]){4}$/)) {
            setError("invalid Year");
            return false;
        }
        else if (alumniData.password == "" || alumniData.cpassword == "" || !alumniData.password.match(/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/) || !alumniData.cpassword.match(/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/)) {
            setError("Invalid password");
            return false;
        }
        else if (alumniData.password != alumniData.cpassword) {
            return false;
        }
        else {
            return true;
        }
    }
    const handleClick = async () => {
        if (student) {
            const data = studentData;
            if (validateStudent(data)) {
                data.role = "Student";
                const studentRef = collection(db, "Student");
                let q = query(studentRef, where("prn", "==", data.prn));
                const querySnapshot = await getDocs(q);
                console.log(querySnapshot.size)
                if (querySnapshot.size == 0) {
                    setError("prn not found, please contact your college");
                }
                else {
                    try {
                        const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);
                        await sendEmailVerification(userCred.user, { url: "http://localhost:3000/Chat" });
                        delete data.password
                        delete data.cpassword
                        data.id = userCred.user.uid;
                        data.photoUrl = "/Images/avatardefault.png";
                        const s = await axios.post(url + "/UserDetails", data);
                        console.log(s);
                        setSuccess("Your Verification mail is sent !");
                    }
                    catch (e) {
                        setError(e.message);
                    }
                }
            }
        }
        else if (teacher) {
            console.log(teacherData)
            const data = teacherData;
            if (validateTeacher(data)) {
                data.role = "Teacher";
                const teacherRef = collection(db, "Teacher");
                let q = query(teacherRef, where("empid", "==", data.empCode));
                const querySnapshot = await getDocs(q);
                console.log(querySnapshot.size)
                if (querySnapshot.size == 0) {
                    setError("empolyee Code not found, please contact your college");
                }
                else {
                    try {
                        const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);
                        await sendEmailVerification(userCred.user, { url: "http://localhost:3000/Chat" });
                        delete data.password
                        delete data.cpassword
                        data.id = userCred.user.uid;
                        data.photoUrl = "/Images/avatardefault.png";
                        const s = await axios.post(url + "/UserDetails", data);
                        console.log(s);
                        setSuccess("Your Verification mail is sent !");
                    }
                    catch (e) {
                        setError(e.message);
                    }
                }
            }
        }
        else {
            const data = aluminiData;
            if (validateAlumni(data)) {
                data.role = "Alumini";
                const aluminiRef = collection(db, "Alumini");
                let q = query(aluminiRef, where("prn", "==", data.prn));
                const querySnapshot = await getDocs(q);
                console.log(querySnapshot.size)
                if (querySnapshot.size == 0) {
                    setError("prn not found, please contact your college");
                }
                else {
                    try {
                        const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);
                        await sendEmailVerification(userCred.user, { url: "http://localhost:3000/Chat" });
                        delete data.password
                        delete data.cpassword
                        data.id = userCred.user.uid;
                        data.photoUrl = "/Images/avatardefault.png";
                        const s = await axios.post(url + "/UserDetails", data);
                        console.log(s);
                        setSuccess("Your Verification mail is sent !");
                    }
                    catch (e) {
                        setError(e.message);
                    }
                }
            }
        }
    }

    const handleOnClick = (role) => {
        switch (role) {
            case 0:
                setStudent(true);
                setAlumini(false);
                setTeacher(false);
                setStudentData(defaultStudent);
                setAluminiData(defaultAlumini);
                setTeacherData(defaultTeacher);
                break;
            case 1:
                setStudent(false);
                setAlumini(false);
                setTeacher(true);
                setStudentData(defaultStudent);
                setAluminiData(defaultAlumini);
                setTeacherData(defaultTeacher);
                break;
            case 2:
                setStudent(false);
                setAlumini(true);
                setTeacher(false);
                setStudentData(defaultStudent);
                setAluminiData(defaultAlumini);
                setTeacherData(defaultTeacher);
                break;
        }
    }
    return(
        <div className={style.login}>
            <div className={style.signup}>

                <img className={style.signupImage} src="Images/Login_Art.png" alt="Login" />

                <div className={style.Content}>
                    <span className={style.title}>SIGN <span className={style.titleBlue}>UP</span></span>
                    <div className={style.buttonSet1}>
                            <div className={style.linkSet}>
                                <span className={student ? style.activeText1 : style.link1} onClick={()=>{handleOnClick(0)}}>S</span>
                                <span className={teacher ? style.activeText1 : style.link1} onClick={()=>{handleOnClick(1)}}>T</span>
                                <span className={alumini ? style.activeText1 : style.link1} onClick={()=>{handleOnClick(2)}}>A</span>
                            </div>
                    </div>
                    <span className={style.error}> {error != "" && error } </span>
                    <span className={style.success}> {success != "" && success} </span>
                    {student ? <>
                        <div className={style.signupForm}>
                            <div className={style.section}>
                                <label for="Name" className={loginStyle.label}>Name</label>
                                <input className={style.box} type="text" id="Name" value={studentData.FullName} onChange={(e) => { setStudentData({ ...studentData, FullName: e.target.value }) }} />
                                <label for="PRN" className={loginStyle.label}>PRN</label>
                                <input className={style.box} type="text" id="PRN" value={studentData.prn} onChange={(e) => { setStudentData({ ...studentData, prn: e.target.value }) }} />
                                <span className={style.span}><label for="Branch" className={loginStyle.label}>Branch</label>
                                    <select className={style.dropBox} value={studentData.branch} onChange={(e) => { setStudentData({ ...studentData, branch: e.target.value }) }}>
                                        <option value="">Branch</option>
                                        <option value="computer">Computer</option>
                                        <option value="information_technology">Information Technology</option>
                                        <option value="mechanical">Mechanical</option>
                                        <option value="electrical">Electrical</option>
                                        <option value="electronics">Electronics</option>
                                    </select></span>
                            </div>
                            <div className={style.section}>
                                <span className={style.span}>
                                    <label for="Year" className={loginStyle.label}>Year</label>
                                    <input className={style.box} type="text" id="Year" value={studentData.year} onChange={(e) => { setStudentData({ ...studentData, year: e.target.value }) }} />
                                </span>
                                <label for="Password" className={loginStyle.label}>Password</label>
                                <input className={style.box} type="password" id="Password" value={studentData.password} onChange={(e) => { setStudentData({ ...studentData, password: e.target.value }) }} />
                                <label for="Confirm Password" className={loginStyle.label}>Confirm Password</label>
                                <input className={style.box} type="password" id="Confirm Password" value={studentData.cpassword} onChange={(e) => { setStudentData({ ...studentData, cpassword: e.target.value }) }} />
                            </div>
                            <div className={style.section}>
                                <span className={style.span}><label for="Email" className={loginStyle.label}>Email</label>
                                    <input className={style.box} type="text" id="Email" value={studentData.email} onChange={(e) => { setStudentData({ ...studentData, email: e.target.value }) }} /></span>
                            </div>
                        </div>

                    </> : teacher ? <>
                        <div className={style.signupForm}>
                            <div className={style.section}>
                                <label for="Name" className={loginStyle.label}>Name</label>
                                <input className={style.teacherBox} type="text" id="Name" value={teacherData.FullName} onChange={(e) => { setTeacherData({ ...teacherData, FullName: e.target.value }) }} />
                                <label for="Emp Code" className={loginStyle.label}>Employee Code</label>
                                <input className={style.teacherBox} type="text" id="Emp Code" value={teacherData.empCode} onChange={(e) => { setTeacherData({ ...teacherData, empCode: e.target.value }) }} />
                                <span className={style.span}>
                                    <label for="qualification" className={loginStyle.label}>Qualification</label>
                                    <input className={style.teacherBox} type="text" id="qualification" value={teacherData.qualification} onChange={(e) => { setTeacherData({ ...teacherData, qualification: e.target.value }) }} />
                                </span>
                            </div>
                            <div className={style.section}>
                                <span className={style.span}>
                                    <label for="Email" className={loginStyle.label}>Email</label>
                                    <input className={style.teacherBox} type="text" id="teacherEmail" value={teacherData.email} onChange={(e) => { setTeacherData({ ...teacherData, email: e.target.value }) }} />
                                </span>
                                <label for="Password" className={loginStyle.label}>Password</label>
                                <input className={style.teacherBox} type="password" id="Password" value={teacherData.password} onChange={(e) => { setTeacherData({ ...teacherData, password: e.target.value }) }} />
                                <label for="Confirm Password" className={loginStyle.label}>Confirm Password</label>
                                <input className={style.teacherBox} type="password" id="Confirm Password" value={teacherData.cpassword} onChange={(e) => { setTeacherData({ ...teacherData, cpassword: e.target.value }) }} />
                            </div>

                        </div>


                    </> : <>
                        <div className={style.signupForm}>
                            <div className={style.section}>
                                <label for="Name" className={loginStyle.label}>Name</label>
                                <input className={style.box} type="text" id="Name" value={aluminiData.FullName} onChange={(e) => { setAluminiData({ ...aluminiData, FullName: e.target.value }) }} />
                                <label for="PRN" className={loginStyle.label}>{"PRN"}</label>
                                <input className={style.box} type="text" id="PRN" value={aluminiData.prn} onChange={(e) => { setAluminiData({ ...aluminiData, prn: e.target.value }) }} />

                                <span className={style.span}>
                                    <label for="org" className={loginStyle.label}>Organization</label>
                                    <input className={style.box} type="text" id="org" value={aluminiData.org} onChange={(e) => { setAluminiData({ ...aluminiData, org: e.target.value }) }} />
                                </span>
                            </div>
                            <div className={style.section}>
                                <span className={style.span}>
                                    <label for="jobRole" className={loginStyle.label}>Job Role</label>
                                    <input className={style.box} type="text" id="jobRole" value={aluminiData.jobRole} onChange={(e) => { setAluminiData({ ...aluminiData, jobRole: e.target.value }) }} />
                                </span>
                                <label for="Password" className={loginStyle.label}>Password</label>
                                <input className={style.box} type="password" id="Password" value={aluminiData.password} onChange={(e) => { setAluminiData({ ...aluminiData, password: e.target.value }) }} />
                                <label for="Confirm Password" className={loginStyle.label}>Confirm Password</label>
                                <input className={style.box} type="password" id="Confirm Password" value={aluminiData.cpassword} onChange={(e) => { setAluminiData({ ...aluminiData, cpassword: e.target.value }) }} />
                            </div>
                            <div className={style.section}>
                                <span className={style.span}><label for="Email" className={loginStyle.label}>Email</label>
                                    <input className={style.box} type="text" id="Email" value={aluminiData.email} onChange={(e) => { setAluminiData({ ...aluminiData, email: e.target.value }) }} /></span>
                                <span className={style.span}>
                                    <label for="Year" className={loginStyle.label}>Passout Year</label>
                                    <input className={style.box} type="text" id="Year" value={aluminiData.passout_year} onChange={(e) => { setAluminiData({ ...aluminiData, passout_year: e.target.value }) }} />
                                </span>
                            </div>
                        </div>
                    </>}
                    <div className={style.buttonSet}>
                        <input className={style.submit} type="button" name="Register" value="Register" onClick={() => handleClick()} />
                        <div className={style.linkSet}>
                            <span className={student ? style.activeText : style.link} onClick={() => { handleOnClick(0) }}>Student</span>
                            <span className={teacher ? style.activeText : style.link} onClick={() => { handleOnClick(1) }}>Teacher</span>
                            <span className={alumini ? style.activeText : style.link} onClick={() => { handleOnClick(2) }}>Alumni</span>
                        </div>
                    </div>
                    <center>
                        <input className={style.submit1} type="button" name="Register" value="Register" onClick={()=>handleClick()}/>
                    </center>

                    <Link to="/Login" className={style.text}>Already have an Account?</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;