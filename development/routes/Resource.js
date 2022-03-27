const express = require("express");
const {db} = require("../config");
const [textencrypt,textdecrypt] = require("../encrypto");

const Db = db;
const resources = Db.collection('Resources');
const router = express.Router();

router.post("/", async (req,res)=>{
    /*
    {
        resourceId:
        resourceName:
        type:
        branch:
        owner:{senderId,role}
        description:
        size:
        url:
        timeline:
    }
    */
    const data = req.body;
    console.log(data);
    if(data.resourceName != null && data.type != null && data.owner != null && data.description != null && data.size != null && data.url != null && data.timeline != null && data.branch != null){
        if(data.owner.senderId != null && data.owner.role != null){

            data.resourceName = textencrypt(data.resourceName);
            data.type = textencrypt(data.type);
            data.owner.role = textencrypt(data.owner.role);
            data.description = textencrypt(data.description);
            data.branch = textencrypt(data.branch);
            data.size = textencrypt(data.size);
            data.url = textencrypt(data.url);
            data.timeline = textencrypt(data.timeline);

            await resources.add(req.body).then(()=>{
                res.send({
                    msg:"Resource added"
                });
            })
            .catch((err)=>{
                res.send({
                    msg:err.message
                });
            });
        }
        else{
            res.send({msg:"Invalid or missing data"});
        }
    }
    else{
        res.send({msg:"Invalid or missing data"});
    }
});

router.get("/",async (req,res)=>{
    try{
    const snapshot = await resources.get().catch((err)=>{
        res.send({msg:err.message});
    });
    const data = snapshot.docs.map((doc)=>{
        const data = doc.data();
        data.resourceName = textdecrypt(data.resourceName);
        data.type = textdecrypt(data.type);
        data.owner.role = textdecrypt(data.owner.role);
        data.description = textdecrypt(data.description);
        data.branch = textdecrypt(data.branch);
        data.size = textdecrypt(data.size);
        data.url = textdecrypt(data.url);
        data.timeline = textdecrypt(data.timeline);
        return {id:doc.id,...data}
    });
    res.send(data);
    }
    catch(err){
        res.send({msg:err.message});
    }
});

router.get("/:resourceId",async (req,res)=>{
    try{
    const snapshot = await resources.where("__name__","==",req.params.resourceId).get().catch((err)=>{
        res.send({msg:err.message});
    });;
    const response = snapshot.docs.map((doc)=>{
        const data = doc.data();
        data.resourceName = textdecrypt(data.resourceName);
        data.type = textdecrypt(data.type);
        data.owner.role = textdecrypt(data.owner.role);
        data.description = textdecrypt(data.description);
        data.size = textdecrypt(data.size);
        data.branch = textdecrypt(data.branch);
        data.url = textdecrypt(data.url);
        data.timeline = textdecrypt(data.timeline);
        return {id:doc.id,...data}
    });
    res.send(response);
    }
    catch(err){
        res.send({msg:err.message});
    }
});


router.delete("/:resourceId",async (req,res)=>{
    try{
        await resources.doc(req.params.resourceId).delete();
        res.send({
            msg:"resource deleted"
        });
    }
    catch(err){
        res.send(err.message)
    }
});


module.exports = router;

