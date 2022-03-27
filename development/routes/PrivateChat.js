const express = require("express");
const {db} = require("../config");
const [textencrypt,textdecrypt] = require("../encrypto");

const route = express.Router();

const Db = db;
const privateChat = Db.collection("Private Chat");

/*
{
    senderId:
    receiverId:
    chats:[
        {
            owner:id,
            message:{
                messageId:
                messageContent:
                type:
                timeline
            }
        }
    ]
}
*/


route.post('/:id',async(req,res)=>{
    const data = req.body;
    try{
        if(data && data.chats && data.senderId && data.receiverId){
            await privateChat.doc(req.params.id).set(data);
            return res.json({msg:"Document Added"});
        }
    }
    catch(e){
        console.log(e.message);
    }
})


route.patch('/:id',async(req,res)=>{
    const data = req.body;
    try{
        if(data && data.chats && data.senderId && data.receiverId){
            data.chats.map((r)=>{
                if(r.owner && r.message.messageId && r.messageContent && r.type && r.timeline){
                    console.log(r)
                    r.owner = data.owner;
                    r.message.messageId = textencrypt(r.message.messageId);
                    r.message.messageContent = textencrypt(r.message.messageContent);
                    r.message.type = textencrypt(r.message.type);
                    r.message.timeline = textencrypt(r.message.timeline);
                }

            })
            await privateChat.doc(req.params.id).update(data);
            return res.json({msg:"Document Updated"});
        }
    }
    catch(e){
        console.log(e.message);
    }
})


route.get('/:id',async(req,res)=>{
    try{
        const ref = privateChat.doc(req.params.id);
        const doc =await ref.get();
        if(doc.exists){
            const data = doc.data();
            if(data && data.chats && data.senderId && data.receiverId){
                data.chats.map((r)=>{
                    if(r.owner && r.message.messageId && r.messageContent && r.type && r.timeline){
                        r.owner = data.owner;
                        r.message.messageId = textdecrypt(r.message.messageId);
                        r.message.messageContent = textdecrypt(r.message.messageContent);
                        r.message.type = textdecrypt(r.message.type);
                        r.message.timeline = textdecrypt(r.message.timeline);
                    }
                })
            }
            res.send(data)
        }
        else{
            return res.json({msg:"data not found"});
        }
    }
    catch(e){
        console.log(e.message);
    }
})



module.exports = route;

