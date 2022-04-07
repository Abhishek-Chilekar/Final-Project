const express = require("express");
const {db} = require("../config");
const [textEncrypt,textDecrypt] = require("../encrypto");

const Db = db;
const notification = Db.collection("Notification");
const router = express.Router();

/*
[{
    image:
    purpose:
    heading:
    content:
    id:
    url:
    branch:
}]
*/

router.post("/",async(req,res)=>{
    try{
        const data = req.body;
        if(data.heading != null && data.content != null && data.url != null && data.branch != null && data.purpose != null && data.image != null){
           data.heading = textEncrypt(data.heading);
           data.content = textEncrypt(data.content);
           data.url = textEncrypt(data.url);
           data.branch = textEncrypt(data.branch);
           data.purpose = textEncrypt(data.purpose);
           data.image = textEncrypt(data.image);
           const {id} = await notification.add(data).catch((err)=>{
               res.send({msg:err.message})
           });
           res.send({id});
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
            data.heading = textDecrypt(data.heading);
            data.content = textDecrypt(data.content);
            data.url = textDecrypt(data.url);
            data.branch = textDecrypt(data.branch);
            data.purpose = textDecrypt(data.purpose);
            data.image = textDecrypt(data.image);
            return {id:doc.id,...data}
        });
        console.log(data);
        res.send(data);
    }
    catch(err){
        res.send({msg:err});
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