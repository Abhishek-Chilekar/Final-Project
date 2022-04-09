const express = require("express");
const {db} = require("../config");
const [textencrypt,textdecrypt] = require("../encrypto");

const Db = db;
const events = Db.collection('Events');
const router = express.Router();

//Events post at /
router.post("/", async (req,res)=>{
   try{
    const data = req.body;
    /*
    [{
        eventId :
        eventName:
        owner:{senderId: , role:}
        till:
        url:
        branch:
        from:
        description:
        image:
        registeredUser:[userId]
    }]
    */ 
    
    if(data.eventName != null && data.till != null && data.owner != null && data.description != null && data.from != null && data.image != null && data.branch != null && data.url != null){
        if                          (data.owner.senderId != null && data.owner.role != null){

            const snapshot = await events.get().catch((err)=>{
                res.send({
                    msg:err.message
                    });
                });
                let isDuplicate = false;
                snapshot.docs.map((doc) =>{
                    const dat = doc.data();
                    if(textdecrypt(dat.eventName).toLowerCase() == data.eventName.toLowerCase())
                    {
                        console.log(textdecrypt(dat.eventName)+"\tDuplicate Detected\t"+data.eventName);
                        isDuplicate = true;
                        return;
                    }
                });
                if(isDuplicate)
                {
                    res.send({
                        msg:"Event Already Exists"
                    });
                    return;
                }
            data.eventName = textencrypt(data.eventName);
            data.branch = textencrypt(data.branch);
            data.url = textencrypt(data.url);
            data.till = textencrypt(data.till);
            data.description = textencrypt(data.description);
            data.from = textencrypt(data.from);
            data.image = textencrypt(data.image);
            data.owner.role = textencrypt(data.owner.role);
            data.registeredUser = [];
            await events.add(data).then(()=>{
                res.send({
                    msg:"Event Added"
                });
            }).catch((err)=>{
            res.send({
                msg:err.message
                });
            });
        }
        else{
            res.send("Invalid or missing data");
        }
    }
    else{
        res.send("Invalid or missing data 1");
    }
   }
   catch(err){
       res.send(err.message);
   }
});


router.get("/", async (req,res)=>{
   try
   {
    const snapshot = await events.get().catch((err)=>{
        res.send({
            msg:err.message
            });
        });
    const d = snapshot.docs.map((doc)=>{
        const data = doc.data();

        console.log(data)
        data.eventName = textdecrypt(data.eventName);
        data.till = textdecrypt(data.till);
        data.from = textdecrypt(data.from);
        data.branch = textdecrypt(data.branch);
        data.url = textdecrypt(data.url);
        data.description = textdecrypt(data.description);
        data.image = textdecrypt(data.image);
        data.owner.role = textdecrypt(data.owner.role);
        data.registeredUser = data.registeredUser;
        return {id:doc.id,...data}
    });
    res.send(d);
   }
   catch(err)
   {
    res.send({msg:err.message});
   }
});

router.get("/:eventId", async (req,res)=>{
    try
    {
     const snapshot = await events.where("__name__","==",req.params.eventId).get().catch((err)=>{
        res.send({
            msg:err.message
            });
        });;
     const data = snapshot.docs.map((doc)=>{
            const data = doc.data(); 
            data.eventName = textdecrypt(data.eventName);
            data.till = textdecrypt(data.till);
            data.from = textdecrypt(data.from);
            data.description = textdecrypt(data.description);
            data.branch = textdecrypt(data.branch);
            data.url = textdecrypt(data.url);
            data.image = textdecrypt(data.image);
            data.owner.role = textdecrypt(data.owner.role);
            data.registeredUser = data.registeredUser;
            return {id:doc.id,...data}
     });
     res.send(data);
    }
    catch(err)
    {
     res.send({msg:err.message});
    }
 });

//Events delete at /eventId
router.delete("/:eventId", async (req,res)=>{
   try{
    await events.doc(req.params.eventId).delete().catch((err)=>{
        res.send({
            msg:err.message
        });
    });
    res.send({
        msg:"event deleted"
    })
   }
   catch(err){
       res.send(err.message)
   }
});

module.exports = router;