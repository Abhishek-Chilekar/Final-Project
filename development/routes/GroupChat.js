const express = require("express");
const {db} = require("../config");
const [textencrypt,textdecrypt] = require("../encrypto");

const Db = db;
const groupchat = Db.collection('Group Details');
const router = express.Router();


/*
{
    groupId:
    photoUrl:
    groupName:
    groupDescription:
    member:[{senderId,role,isAdmin}]
    chat:[{messageId,senderName,content,timeline}]
    poll:[{pollId,question,senderName,options:[{name,percentage}],user:[]}]
    requests:[userid]
}
*/

//Get Group Chat by Group ID
router.get("/:groupId", async (req,res)=>{
    try
    {
        const snapshot = await groupchat.where("__name__","==",req.params.groupId).get().catch((err)=>{
            res.send({
                msg:err.message
                });
            });;
        const response = snapshot.docs.map((doc)=>{
            const data = doc.data();
            data.groupName = textdecrypt(data.groupName);
            data.groupDescription = textdecrypt(data.groupDescription);
            data.photoUrl = textdecrypt(data.photoUrl);
            data.member = data.member.map((m)=>{
                m.role = textdecrypt(m.role);
                m.isAdmin = textdecrypt(m.isAdmin);
                return m;
            });
           
            if(data.chat != null){
                data.chat = data.chat.map((c)=>{
                    c.senderId = textdecrypt(c.senderId);
                    c.type = textdecrypt(c.type);
                    c.senderName = textdecrypt(c.senderName);
                    c.imagePath = textdecrypt(c.imagePath);
                    c.content = textdecrypt(c.content);
                    c.timeline = textdecrypt(c.timeline);
                    return c;
                });
            }
            else{
                data.chat=[];
            }
            if(data.poll != null){
                data.poll = data.poll.map((p)=>{
                    p.senderId = textdecrypt(p.senderId);
                    p.question = textdecrypt(p.question);
                    p.senderName = textdecrypt(p.senderName);
                    p.options = p.options.map((o)=>{
                        o.name = textdecrypt(o.name);
                        o.percentage = textdecrypt(o.percentage);
                        return o;
                    });
                    if(p.user != null){
                        p.user = p.user.map((u)=>textdecrypt(u));
                    }
                    else{
                        p.user = [];
                    }
                    return p;
                });
            }
            else{
                data.poll=[];
            }
            if(data.requests != null){
                data.requests = data.requests.map((p)=>textdecrypt(p));
            }
            else{
                data.requests = [];
            }
            return {id:doc.id,...data}
        });
        console.log(response);
        res.send(response);
    }
    catch(err)
    {
        res.send({msg:err.message});
    }
});

//Get Group Chat All
router.get("/",async (req,res)=>{
    try
    {
        const snapshot = await groupchat.get().catch((err)=>{
            res.send({
                msg:err.message
                });
            });;
        const response = snapshot.docs.map((doc)=>{
            const data = doc.data();
            data.groupName = textdecrypt(data.groupName);
            data.groupDescription = textdecrypt(data.groupDescription);
            data.photoUrl = textdecrypt(data.photoUrl);
            data.member = data.member.map((m)=>{
                m.role = textdecrypt(m.role);
                m.isAdmin = textdecrypt(m.isAdmin);
                return m;
            });
            if(data.chat != null){
            data.chat = data.chat.map((c)=>{
                c.senderId = textdecrypt(c.senderId);
                c.type = textdecrypt(c.type);
                c.senderName = textdecrypt(c.senderName);
                c.imagePath = textdecrypt(c.imagePath);
                c.content = textdecrypt(c.content);
                c.timeline = textdecrypt(c.timeline);
                return c;
            });
            }
            else{
                data.chat=[];
            }
            if(data.poll != null){
            data.poll = data.poll.map((p)=>{
                p.senderId = textdecrypt(p.senderId);
                p.question = textdecrypt(p.question);
                p.senderName = textdecrypt(p.senderName);
                p.options = p.options.map((o)=>{
                    o.name = textdecrypt(o.name);
                    o.percentage = textdecrypt(o.percentage);
                    return o;
                });
                if(p.user != null){
                    p.user = p.user.map((u)=>textdecrypt(u));
                }
                else{
                    p.user = [];
                }
                return p;
            });
            }
            else{
                data.poll = [];
            }
            if(data.requests != null){
                data.requests = data.requests.map((p)=>textdecrypt(p));
            }
            else{
                data.requests = [];
            }
            return {id:doc.id,...data}
        });
        res.send(response);
    }
    catch(err){
        res.send({msg:err.message});
    }
});

//Update Group Details
/*
{
    groupId:
    groupName:
    groupDescription:
    member:[{senderId,role,isAdmin}]
    chat:[{messageId,senderId,type,senderName,type,content,timeline}]
    poll:[{pollId,senderId,senderName,options:[{name,percentage}]}]
    requests:[userid]
}
*/
router.patch("/:groupId",async(req,res)=>{
    try {
        const id = req.params.groupId;
        const data = req.body;
        if(data.groupName != null && data.groupDescription != null && data.member != null ){
            data.groupName = textencrypt(data.groupName);
            data.groupDescription = textencrypt(data.groupDescription);
            data.photoUrl = textencrypt(data.photoUrl);
            if(data.chat != null){
                data.chat = data.chat.map((c)=>{
                    c.senderId = textencrypt(c.senderId);
                    c.type=textencrypt(c.type);
                    c.senderName = textencrypt(c.senderName);
                    c.imagePath = textencrypt(c.imagePath);
                    c.content = textencrypt(c.content);
                    c.timeline = textencrypt(c.timeline);
                    return c;
                 });
            }
            else{
                data.chat=[];
            }
            if(data.poll != null){
                data.poll = data.poll.map((p)=>{
                    p.senderId = textencrypt(p.senderId);
                    p.question = textencrypt(p.question);
                    p.senderName = textencrypt(p.senderName);
                    p.options = p.options.map((o)=>{
                        o.name = textencrypt(o.name);
                        o.percentage = textencrypt(o.percentage);
                        return o;
                     });
                     if(p.user != null){
                        p.user = p.user.map((u)=>textencrypt(u));
                    }
                    else{
                        p.user = [];
                    }
                    return p;
                 });
            }
            else{
                data.poll=[];
            }
            if(data.requests != null){
                data.requests = data.requests.map((p)=>textencrypt(p));
            }
            else{
                data.requests=[];
            }
            data.member = data.member.map((m)=>{
                if(m.role != null && m.isAdmin != null){
                       m.role = textencrypt(m.role);
                       m.isAdmin = textencrypt(m.isAdmin);
                       return m;
                }
                else{
                    return;
                }
            });
            await groupchat.doc(id).update(data).catch((err)=>{
                res.send({
                    msg:err.message
                    });
                });;
            res.send({msg:"Group Details Updated"});
        }
        else{
            res.send("Invalid and missing data");
        }
        
    } catch (err) {
        res.send({msg:err.message});
    }
});

//Add Group
router.post("/",async (req,res)=>{
    const data = req.body;
    if(data.groupName != null && data.groupDescription != null && data.member != null){
        const snapshot = await groupchat.get().catch((err)=>{
            res.send({
                msg:err.message
                });
            });;
            let isDuplicate = false;
            snapshot.docs.map((doc) => {
                const dat = doc.data();
                if(textdecrypt(dat.groupName).toLowerCase() == data.groupName.toLowerCase())
                {
                    console.log(textdecrypt(dat.groupName).toLowerCase() +"\tDuplicate Detected\t"+ data.groupName.toLowerCase());
                    isDuplicate = true;
                    return;
                }
            });
            if(isDuplicate)
            {
                res.send({
                    msg:"Group Already Exists"
                });
                return;
            }
        data.groupName = textencrypt(data.groupName);
        data.groupDescription = textencrypt(data.groupDescription);
        data.photoUrl = textencrypt(data.photoUrl);
        if(data.chat != null){
            data.chat = data.chat.map((c)=>{
                c.senderId = textencrypt(c.senderId);
                c.type=textencrypt(c.type);
                c.senderName = textencrypt(c.senderName);
                c.imagePath = textencrypt(c.imagePath);
                c.content = textencrypt(c.content);
                c.timeline = textencrypt(c.timeline);
                return c;
             });
        }
        else{
            data.chat=[];
        }
        if(data.poll != null){
            data.poll = data.poll.map((p)=>{
                p.senderId = textencrypt(p.senderId);
                p.question = textencrypt(p.question);
                p.senderName = textencrypt(p.senderName);
                p.options = p.options.map((o)=>{
                    o.name = textencrypt(o.name);
                    o.percentage = textencrypt(o.percentage);
                    return o;
                });
                if(p.user != null){
                    p.user = p.user.map((u)=>textencrypt(u));
                }
                else{
                    p.user = [];
                }
                return p;
             });
        }
        else{
            data.poll=[];
        }
        if(data.requests != null){
            data.requests = data.requests.map((p)=>textencrypt(p));
        }
        else{
            data.requests=[];
        }
        data.member = data.member.map((m)=>{
            if(m.role != null && m.isAdmin != null){
                   m.role = textencrypt(m.role);
                   m.isAdmin = textencrypt(m.isAdmin+"");
                   return m;
            }
            else{
                return;
            }
        });
        await groupchat.add(req.body).then(({id})=>{
            res.send({
                id
            });
        })
        .catch((err)=>{
            res.send({
                msg:err.message
            });
        });
    }
    else{
        res.send("Invalid and missing data");
    }
});

//Delete Group
router.delete("/:groupId", async (req,res)=>{
    try{
        await groupchat.doc(req.params.groupId).delete()
        .catch((err)=>{
            res.send({
                msg:err.message
            });
        });
        res.send({msg:"group deleted"});
    }
    catch(err){
        res.send(err.message)
    }
});

module.exports = router;