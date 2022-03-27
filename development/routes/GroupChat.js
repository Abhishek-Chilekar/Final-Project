const express = require("express");
const {db} = require("../config");
const [textencrypt,textdecrypt] = require("../encrypto");

const Db = db;
const groupchat = Db.collection('Group Details');
const router = express.Router();


/*
{
    groupId:
    groupName:
    groupDescription:
    member:[{senderId,role,isAdmin}]
    chat:[{messageId,senderName,content,timeline}]
    poll:[{pollId,senderName,options:[{name,percentage}]}]
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
            data.member = data.member.map((m)=>{
                m.role = textdecrypt(m.role);
                m.isAdmin = textdecrypt(m.isAdmin);
                return m;
            });
            if(data.chat != null){
                data.chat = data.chat.map((c)=>{
                    c.senderName = textdecrypt(c.senderName);
                    c.content = textdecrypt(c.content);
                    c.timeline = textdecrypt(c.timeline);
                    return c;
                });
            }
            if(data.poll != null){
                data.poll = data.poll.map((p)=>{
                    p.senderName = textdecrypt(p.senderName);
                    p.options = p.options.map((o)=>{
                        o.name = textdecrypt(o.name);
                        o.percentage = textdecrypt(o.percentage);
                        return o;
                    });
                    return p;
                });
            }
            if(data.requests != null){
                data.requests = data.requests.map((p)=>textdecrypt(p));
            }
            return {id:doc.id,...data}
        });
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
            data.member = data.member.map((m)=>{
                m.role = textdecrypt(m.role);
                m.isAdmin = textdecrypt(m.isAdmin);
                return m;
            });
            if(data.chat != null){
            data.chat = data.chat.map((c)=>{
                c.senderName = textdecrypt(c.senderName);
                c.content = textdecrypt(c.content);
                c.timeline = textdecrypt(c.timeline);
                return c;
            });
            }
            if(data.poll != null){
            data.poll = data.poll.map((p)=>{
                p.senderName = textdecrypt(p.senderName);
                p.options = p.options.map((o)=>{
                    o.name = textdecrypt(o.name);
                    o.percentage = textdecrypt(o.percentage);
                    return o;
                });
                return p;
            });
            }
            if(data.requests != null){
                data.requests = data.requests.map((p)=>textdecrypt(p));
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
    chat:[{messageId,senderName,content,timeline}]
    poll:[{pollId,senderName,options:[{name,percentage}]}]
    requests:[userid]
}
*/
router.patch("/:groupId",async(req,res)=>{
    try {
        const id = req.params.groupId;
        const data = req.body;
        if(data.groupName != null && data.groupDescription != null && data.member != null){
            data.groupName = textencrypt(data.groupName);
            data.groupDescription = textencrypt(data.groupDescription);
            if(data.chat != null){
                data.chat = data.chat.map((c)=>{
                    c.senderName = textencrypt(c.senderName);
                    c.content = textencrypt(c.content);
                    c.timeline = textencrypt(c.timeline);
                    return c;
                 });
            }
            if(data.poll != null){
                data.poll = data.poll.map((p)=>{
                    p.senderName = textencrypt(p.senderName);
                    p.options = p.options.map((o)=>{
                        o.name = textencrypt(o.name);
                        o.percentage = textencrypt(o.percentage);
                        return o;
                     });
                    return p;
                 });
            }
            if(data.requests != null){
                data.requests = data.requests.map((p)=>textencrypt(p));
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
        data.groupName = textencrypt(data.groupName);
        data.groupDescription = textencrypt(data.groupDescription);
        if(data.chat != null){
            data.chat = data.chat.map((c)=>{
                c.senderName = textencrypt(c.senderName);
                c.content = textencrypt(c.content);
                c.timeline = textencrypt(c.timeline);
                return c;
             });
        }
        if(data.poll != null){
            data.poll = data.poll.map((p)=>{
                p.senderName = textencrypt(p.senderName);
                p.options = p.options.map((o)=>{
                    o.name = textencrypt(o.name);
                    o.percentage = textencrypt(o.percentage);
                    return o;
                 });
                return p;
             });
        }
        if(data.requests != null){
            data.requests = data.requests.map((p)=>textencrypt(p));
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
        await groupchat.add(req.body).then(()=>{
            res.send({
                msg:"Group Added"
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
        res.send({msg:"resource deleted"});
    }
    catch(err){
        res.send(err.message)
    }
});

module.exports = router;