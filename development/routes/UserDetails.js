const express = require("express");
const validator = require("validator");
const {db} = require("../config");
const [textencrypt,textdecrypt] = require("../encrypto");

const Db = db;
const router = express.Router();

const userDetails = Db.collection("User Details");

router.get("/",async (req,res)=>{
    /*
    {
        common :
        UserId:
        photoUrl:
        FullName:
        email:
        skillset:[]
        request:[{requestId,senderId,requestMessage}]
        requestAccepted:[]
        groupId:[]
        myDoc:[]
        role:
        chatId
        -----------------
        student:
        year:       
        branch:
        prn:
        -----------------
        teacher:
        qualification:
        empCode:
        -----------------
        alumin:
        jobTitle:
        prn
        org
        passout_year:
    }
    */
    try{
        const snapshot = await userDetails.get();
        const response = snapshot.docs.map((doc)=>{
            const data = doc.data();
            data.FullName = textdecrypt(data.FullName);
            data.email = textdecrypt(data.email);
            if(!data.photoUrl){
                data.photoUrl = "/Images/avatardefault.png"
            }
            else{
                data.photoUrl = textdecrypt(data.photoUrl);
            }
            if(data.skillset != null){
                data.skillset = data.skillset.map((skill)=>{
                    return textdecrypt(skill);
                });
            }
            else{
                data.skillset = []
            }
            if(data.request != null){
                data.request = data.request.map((req)=>{
                    return {
                        requestId:req.requestId,
                        senderId:req.senderId,
                        requestMessage:textdecrypt(req.requestMessage)
                    };
                });
            }
            else{
                data.request=[]
            }
            if(data.requestAccepted != null){
                data.requestAccepted = data.requestAccepted.map((id)=>{
                   return textdecrypt(id);
                });
            }
            else{
                data.requestAccepted = []
            }
            if(data.groupId != null){
                data.groupId = data.groupId.map((id)=>{
                    return textdecrypt(id);
                });
            }
            else{
                data.groupId = []
            }
            if(data.myDoc != null){
                data.myDoc = data.myDoc.map((id)=>{
                    return textdecrypt(id);
                });
            }
            else{
                data.myDoc = []
            }
            if(data.chatId != null){
                data.chatId = textdecrypt(chatId)
            }
            if(data.year != null && data.branch != null && data.prn != null){
                data.role = textdecrypt(data.role);
                data.year = textdecrypt(data.year);
                data.prn = textdecrypt(data.prn);
                data.branch = textdecrypt(data.branch);
            }
            else if(data.qualification != null && data.empCode != null){
                data.qualification = textdecrypt(data.qualification);
                data.empCode = textdecrypt(data.empCode);
                data.role = textdecrypt(data.role);
            }
            else{
                data.jobRole = textdecrypt(data.jobRole);
                data.org = textdecrypt(data.org);
                data.prn = textdecrypt(data.prn);
                data.passout_year = textdecrypt(data.passout_year);
                data.role = textdecrypt(data.role);
            }
           return {id:doc.id,...data}
        });
        res.send(response);
    }
    catch(err){
        res.send({msg:err});
    }
});

router.get("/:userId",async (req,res)=>{
    try{
        const snapshot = await userDetails.where("__name__","==",req.params.userId).get();
        const data = snapshot.docs.map((doc)=>{
            const data = doc.data();
            data.FullName = textdecrypt(data.FullName);
            data.email = textdecrypt(data.email);
            if(!data.photoUrl){
                data.photoUrl = "/Images/avatardefault.png"
            }
            else{
                data.photoUrl = textdecrypt(data.photoUrl);
            }
            if(data.skillset != null){
                data.skillset = data.skillset.map((skill)=>{
                    return textdecrypt(skill);
                });
            }
            else{
                data.skillset = []
            }
            if(data.request != null){
                data.request = data.request.map((req)=>{
                    return {
                        requestId:req.requestId,
                        senderId:req.senderId,
                        requestMessage:textdecrypt(req.requestMessage)
                    };
                });
            }
            else{
                data.request = []
            }
            if(data.requestAccepted != null){

                data.requestAccepted = data.requestAccepted.map((id)=>{
                   return textdecrypt(id);
                });
            }
            else{
                data.requestAccepted = []
            }
            if(data.groupId != null){
                data.groupId = data.groupId.map((id)=>{
                    return textdecrypt(id);
                });
            }
            else{
                data.groupId = []
            }
            if(data.myDoc != null){
                data.myDoc = data.myDoc.map((id)=>{
                    return textdecrypt(id);
                });
            }
            else{
                data.myDoc = []
            }
            if(data.chatId != null){
                data.chatId = textdecrypt(chatId)
            }
            if(data.year != null && data.branch != null && data.prn != null){
                data.role = textdecrypt(data.role);
                data.year = textdecrypt(data.year);
                data.prn = textdecrypt(data.prn);
                data.branch = textdecrypt(data.branch);
            }
            else if(data.qualification != null && data.empCode != null){
                data.qualification = textdecrypt(data.qualification);
                data.empCode = textdecrypt(data.empCode);
                data.role = textdecrypt(data.role);
            }
            else{
                data.jobRole = textdecrypt(data.jobRole);
                data.org = textdecrypt(data.org);
                data.prn = textdecrypt(data.prn);
                data.passout_year = textdecrypt(data.passout_year);
                data.role = textdecrypt(data.role);
            }
           return {id:doc.id,...data}
        });
        res.send(data);
    }
    catch(err){
        res.send({msg:err.message});
    }
});

/*
    {
        common :
        UserId:
        FullName:
        email:
        skillset:[]
        role:
        -----------------
        student:
        year:       
        branch:
        prn:
        -----------------
        teacher:
        qualification:
        -----------------
        alumin:
        jobTitle:
        passout_year:
    }
    */

router.post("/",async (req,res)=>{
    try{
        const data = req.body;
        if(data.FullName != null && data.email != null && data.photoUrl != null){
            if(validator.isEmail(data.email)){
                if(data.role == 'Student'){
                    if(data.prn != null && data.branch != null && data.year != null){
                        data.FullName = textencrypt(data.FullName);
                        data.email = textencrypt(data.email);
                        data.photoUrl = textencrypt(data.photoUrl);
                        if(data.skillset != null){
                            data.skillset = data.skillset.map((skill)=>{
                                return textencrypt(skill);
                            });
                        }
                        else{
                            data.skillset = []
                        }
                        if(data.request != null){
                            data.request = data.request.map((req)=>{
                                return {
                                    requestId:req.requestId,
                                    senderId:req.senderId,
                                    requestMessage:textencrypt(req.requestMessage)
                                };
                            });
                        }
                        else{
                            data.request = []
                        }
                        if(data.requestAccepted != null){
                            data.requestAccepted = data.requestAccepted.map((id)=>{
                               return textencrypt(id);
                            });
                        }
                        else{
                            data.requestAccepted = []
                        }
                        if(data.groupId != null){
                            data.groupId = data.groupId.map((id)=>{
                                return textencrypt(id);
                            });
                        }
                        else{
                            data.groupId = []
                        }
                        if(data.myDoc != null){
                            data.myDoc = data.myDoc.map((id)=>{
                                return textencrypt(id);
                            });
                        }
                        else{
                            data.myDoc = []
                        }
                        if(data.chatId != null){
                            data.chatId = textencrypt(chatId)
                        }
                        data.role = textencrypt(data.role);
                        data.year = textencrypt(data.year);
                        data.prn = textencrypt(data.prn);
                        data.branch = textencrypt(data.branch);
                        const id = data.id;
                        delete data.id;
                        await userDetails.doc(id).set(data);
                        res.send({msg:"user details saved"});
                    }
                    else{
                        res.send({msg:"Invalid or missing data"});
                    }
                }
                else if(data.role == 'Teacher'){
                    if(data.qualification != null && data.empCode != null){
                        data.FullName = textencrypt(data.FullName);
                        data.email = textencrypt(data.email);
                        data.photoUrl = textencrypt(data.photoUrl)
                        if(data.skillset != null){
                            data.skillset = data.skillset.map((skill)=>{
                                return textencrypt(skill);
                            });
                        }
                        else{
                            data.skillset = []
                        }
                        if(data.request != null){
                            data.request = data.request.map((req)=>{
                                return {
                                    requestId:req.requestId,
                                    senderId:req.senderId,
                                    requestMessage:textencrypt(req.requestMessage)
                                };
                            });
                        }
                        else{
                            data.request = []
                        }
                        if(data.requestAccepted != null){
                            data.requestAccepted = data.requestAccepted.map((id)=>{
                               return textencrypt(id);
                            });
                        }
                        else{
                            data.requestAccepted = []
                        }
                        if(data.groupId != null){
                            data.groupId = data.groupId.map((id)=>{
                                return textencrypt(id);
                            });
                        }
                        else{
                            data.groupId = []
                        }
                        if(data.myDoc != null){
                            data.myDoc = data.myDoc.map((id)=>{
                                return textencrypt(id);
                            });
                        }
                        else{
                            data.myDoc = []
                        }
                        if(data.chatId != null){
                            data.chatId = textencrypt(chatId)
                        }
                        data.qualification = textencrypt(data.qualification);
                        data.empCode = textencrypt(data.empCode);
                        console.log(data);
                        data.role = textencrypt(data.role);
                        console.log(data);
                        const id = data.id;
                        delete data.id;
                        await userDetails.doc(id).set(data);
                        res.send({msg:"user details saved"});
                    }
                    else{
                        res.send({msg:"Invalid or missing data"});
                    }
                }
                else{
                    if(data.jobRole != null && data.org != null && data.prn != null && data.passout_year != null){
                        data.FullName = textencrypt(data.FullName);
                        data.email = textencrypt(data.email);
                        data.photoUrl = textencrypt(data.photoUrl);
                        if(data.skillset != null){
                            data.skillset = data.skillset.map((skill)=>{
                                return textencrypt(skill);
                            });
                        }
                        else{
                            data.skillset = []
                        }
                        if(data.request != null){
                            data.request = data.request.map((req)=>{
                                return {
                                    requestId:req.requestId,
                                    senderId:req.senderId,
                                    requestMessage:textencrypt(req.requestMessage)
                                };
                            });
                        }
                        else{
                            data.request = []
                        }
                        if(data.requestAccepted != null){
                            data.requestAccepted = data.requestAccepted.map((id)=>{
                               return textencrypt(id);
                            });
                        }
                        else{
                            data.requestAccepted = []
                        }
                        if(data.groupId != null){
                            data.groupId = data.groupId.map((id)=>{
                                return textencrypt(id);
                            });
                        }
                        else{
                            data.groupId = []
                        }
                        if(data.myDoc != null){
                            data.myDoc = data.myDoc.map((id)=>{
                                return textencrypt(id);
                            });
                        }
                        else{
                            data.myDoc = []
                        }
                        if(data.chatId != null){
                            data.chatId = textencrypt(chatId)
                        }
                        data.jobRole = textencrypt(data.jobRole);
                        data.prn = textencrypt(data.prn);
                        data.passout_year = textencrypt(data.passout_year);
                        data.org = textencrypt(data.org);
                        data.role = textencrypt(data.role);
                        const id = data.id;
                        delete data.id; 
                        await userDetails.doc(id).set(data);
                        res.send({msg:"user details saved"});
                    }
                    else{
                        res.send({msg:"Invalid or missing data"});
                    }
                }
            }
            else{
                res.send({msg:"Invalid or missing data"});
            }
        }
        else{
            res.send({msg:"Invalid or missing data"});
        }
      
    }
    catch(err){
        res.send({msg:err.message}); 
    }
});

router.patch('/:userId', async(req,res)=>{
    try{
    const data = req.body;
    if(data.FullName != null && data.email != null && data.photoUrl != null){
        if(validator.isEmail(data.email)){
            if(data.role == 'Student'){
                if(data.prn != null && data.branch != null && data.year != null){
                    data.FullName = textencrypt(data.FullName);
                    data.email = textencrypt(data.email);
                    data.photoUrl = textencrypt(data.photoUrl);
                    if(data.skillset != null){
                        data.skillset = data.skillset.map((skill)=>{
                            return textencrypt(skill);
                        });
                    }
                    else{
                        data.skillset = []
                    }
                    if(data.request != null){
                        data.request = data.request.map((req)=>{
                            return {
                                requestId:req.requestId,
                                senderId:req.senderId,
                                requestMessage:textencrypt(req.requestMessage)
                            };
                        });
                    }
                    else{
                        data.request = []
                    }
                    if(data.requestAccepted != null){
                        data.requestAccepted = data.requestAccepted.map((id)=>{
                           return textencrypt(id);
                        });
                        console.log(data);
                    }
                    else{
                        data.requestAccepted = []
                    }
                    if(data.groupId != null){
                        data.groupId = data.groupId.map((id)=>{
                            return textencrypt(id);
                        });
                    }
                    else{
                        data.groupId = []
                    }
                    if(data.myDoc != null){
                        data.myDoc = data.myDoc.map((id)=>{
                            return textencrypt(id);
                        });
                    }
                    else{
                        data.myDoc = []
                    }
                    if(data.chatId != null){
                        data.chatId = textencrypt(chatId)
                    }
                    data.role = textencrypt(data.role);
                    data.year = textencrypt(data.year);
                    data.prn = textencrypt(data.prn);
                    data.branch = textencrypt(data.branch);
                    await userDetails.doc(req.params.userId).update(data);
                    res.send({msg:"data updated"});
                }
                else{
                    res.send({msg:"Invalid or missing data"});
                }
            }
            else if(data.role == 'Teacher'){
                if(data.qualification != null && data.empCode != null){
                    
                    data.FullName = textencrypt(data.FullName);
                    data.email = textencrypt(data.email);
                    data.photoUrl = textencrypt(data.photoUrl)
                    if(data.skillset != null){
                        data.skillset = data.skillset.map((skill)=>{
                            return textencrypt(skill);
                        });
                    }
                    else{
                        data.skillset = []
                    }
                    
                    if(data.request != null){
                        console.log(data.request)
                        data.request = data.request.map((req)=>{
                            return {
                                requestId:req.requestId,
                                senderId:req.senderId,
                                requestMessage:textencrypt(req.requestMessage)
                            };
                        });
                    }
                    else{
                        data.request = []
                    }
                    if(data.requestAccepted != null){
                        data.requestAccepted = data.requestAccepted.map((id)=>{
                           return textencrypt(id);
                        });
                    }
                    else{
                        data.requestAccepted = []
                    }
                    if(data.groupId != null){
                        data.groupId = data.groupId.map((id)=>{
                            return textencrypt(id);
                        });
                    }
                    else{
                        data.groupId = []
                    }
                    if(data.myDoc != null){
                        data.myDoc = data.myDoc.map((id)=>{
                            return textencrypt(id);
                        });
                    }
                    else{
                        data.myDoc = []
                    }
                    if(data.chatId != null){
                        data.chatId = textencrypt(chatId)
                    }
                    data.qualification = textencrypt(data.qualification);
                    data.role = textencrypt(data.role);
                    data.empCode = textencrypt(data.empCode);
                    await userDetails.doc(req.params.userId).update(data);
                    res.send({msg:"data updated"});
                }
                else{
                    res.send({msg:"Invalid or missing data"});
                }
            }
            else{
                if(data.jobRole != null && data.org != null && data.prn != null &&data.passout_year != null){
                    data.FullName = textencrypt(data.FullName);
                    data.email = textencrypt(data.email);
                    data.photoUrl = textencrypt(data.photoUrl);
                    if(data.skillset != null){
                        data.skillset = data.skillset.map((skill)=>{
                            return textencrypt(skill);
                        });
                    }
                    else{
                        data.skillset = []
                    }
                    if(data.request != null){
                        data.request = data.request.map((req)=>{
                            return {
                                requestId:req.requestId,
                                senderId:req.senderId,
                                requestMessage:textencrypt(req.requestMessage)
                            };
                        });
                    }
                    else{
                        data.request = []
                    }
                    if(data.requestAccepted != null){
                        data.requestAccepted = data.requestAccepted.map((id)=>{
                           return textencrypt(id);
                        });
                    }
                    else{
                        data.requestAccepted = []
                    }
                    if(data.groupId != null){
                        data.groupId = data.groupId.map((id)=>{
                            return textencrypt(id);
                        });
                    }
                    else{
                        data.groupId = []
                    }
                    if(data.myDoc != null){
                        data.myDoc = data.myDoc.map((id)=>{
                            return textencrypt(id);
                        });
                    }
                    else{
                        data.myDoc = []
                    }
                    if(data.chatId != null){
                        data.chatId = textencrypt(chatId)
                    }
                    data.jobRole = textencrypt(data.jobRole);
                    data.prn = textencrypt(data.prn);
                    data.role = textencrypt(data.role);
                    data.org = textencrypt(data.org);
                    data.passout_year = textencrypt(data.passout_year);
                    await userDetails.doc(req.params.userId).update(data);
                    res.send({msg:"data updated"});
                }
                else{
                    res.send({msg:"Invalid or missing data"});
                }
            }
        }
        else{
            res.send({msg:"Invalid or missing data"});
        }
    }
    else{
        res.send({msg:"Invalid or missing data"});
    }
  
    }
    catch(err){
       res.send({msg:err.message}); 
    }
   
});

router.delete('/:userId',async(req,res)=>{
    try{
        await userDetails.doc(req.params.userId).delete();
        res.send({msg:"data deleted"});
    }
    catch(err){
        res.send({msg:err});
    }
});

module.exports = router;