const express = require("express");
const {db} = require("../config");
const [textEncrypt,textDecrypt] = require("../encrypto");

const Db = db;
const notification = Db.collection("Notification");
const router = express.Router();



router.post("/",async(req,res)=>{
    try{
        const data = req.body;
        if(data.heading != null && data.content != null && data.url != null && data.branch != null && data.purpose != null && data.image != null && data.contentId != null){
           data.heading = textEncrypt(data.heading);
           data.content = textEncrypt(data.content);
           data.contentId = textEncrypt(data.contentId);
           data.type = textEncrypt(data.type);
           data.url = textEncrypt(data.url);
           data.branch = textEncrypt(data.branch);
           data.purpose = textEncrypt(data.purpose);
           data.image = textEncrypt(data.image);
           if(data.ignoreList){
               data.ignoreList = data.ignoreList.map((id)=>textEncrypt(id));
           }
           else{
               data.ignoreList = [];
           }
           if(data.viewedList)
           {
               data.viewedList  = data.viewedList.map((id) => textEncrypt(id));
           }
           else
           {
               data.viewedList = [];
           }
           const {id} = await notification.add(data).catch((err)=>{
               res.send({msg:err.message})
           });
           res.send({id});
        }
        else{
            res.send({msg:"missing data"});
        }
    }
    catch(err){
        res.send({msg : err.message})
    }
});

router.patch("/:id",async(req,res)=>{
    try{
        const data = req.body;
        if(data.heading != null && data.content != null && data.url != null && data.branch != null && data.purpose != null && data.image != null && data.contentId != null){
           data.heading = textEncrypt(data.heading);
           data.content = textEncrypt(data.content);
           data.contentId = textEncrypt(data.contentId);
           data.type = textEncrypt(data.type);
           data.url = textEncrypt(data.url);
           data.branch = textEncrypt(data.branch);
           data.purpose = textEncrypt(data.purpose);
           data.image = textEncrypt(data.image);
           if(data.ignoreList){
               data.ignoreList = data.ignoreList.map((id)=>textEncrypt(id));
           }
           else{
               data.ignoreList = [];
           }
           if(data.viewedList)
           {
               data.viewedList  = data.viewedList.map((id) => textEncrypt(id));
           }
           else
           {
               data.viewedList = [];
           }
           await notification.doc(req.params.id).update(data);
           res.send({msg:"Notification Updated"});
        }
        else{
            res.send({msg:"missing data"});
        }
    }
    catch(err){
        res.send({msg : err.message})
    }
});

router.get("/",async (req,res)=>{
    try
    {
        const snapshot = await notification.get().catch((err)=>{
            res.send({msg:err.message})
        });
        const data = snapshot.docs.map((doc)=>{
            const data = doc.data();
            console.log(data);
            data.heading = textDecrypt(data.heading);
            data.content = textDecrypt(data.content);
            data.contentId = textDecrypt(data.contentId);
            data.type = textDecrypt(data.type);
            data.url = textDecrypt(data.url);
            data.branch = textDecrypt(data.branch);
            data.purpose = textDecrypt(data.purpose);
            data.image = textDecrypt(data.image);
            if(data.ignoreList){
                data.ignoreList = data.ignoreList.map((id)=>textDecrypt(id));
            }
            else{
                data.ignoreList = [];
            }
            if(data.viewedList)
           {
               data.viewedList  = data.viewedList.map((id) => textDecrypt(id));
           }
           else
           {
               data.viewedList = [];
           }
            return {id:doc.id,...data}
        });
        console.log(data);
        res.send(data);
    }
    catch(err){
        res.send({msg:err.message});
    }
});

router.delete("/:notificationId",async(req,res)=>{
   try{
    await notification.doc(req.params.notificationId).delete()
    .catch((err)=>{
        res.send({
            msg:err.message
        });
    });
    res.send({
        msg:"notification deleted"
    });
   }
   catch(err){
       res.send({msg:err.message})
   }
});

module.exports = router;