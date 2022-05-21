const express = require("express");
const validator = require("validator");
const {data} = require("../config");
const fs = require('fs');
const https = require('https');
const path = require('path');
const [textencrypt,textdecrypt,fileencrypt,filedecrypt,filedecryptimg] = require("../encrypto");

const route = express.Router();
const storage = data;

route.get("/documents/:filename",(req,res)=>{
    //Take Filename
    const filename = req.params.filename;

    //Firebase Storage Reference
    const storageRef = storage.ref();
    //Get File
    storageRef.child("Documents/"+filename).getDownloadURL().then((url) =>{

        //Download the file through Storage
        https.get(url,(r)=>{

            //Read File
            const fileStream = fs.createWriteStream("downloads/"+filename);
            r.pipe(fileStream);
            fileStream.on("error",e=>{
                console.log(e.message);
            });
            fileStream.on("finish",()=>{
                fileStream.close();

                //Decrypt the File
                filedecrypt('downloads/'+filename);

                //Send the File
                res.download("downloads/"+filename,err=>{
                    if(err)
                    {
                        console.error(err.message);
                    }
                    if(res.headersSent)
                    {
                        //Work done Delete File!
                        fs.rmSync('./downloads/'+filename);
                    }
                });
            });
        })
    }).catch((err)=>{
        if(err === null)
        {
            console.error("Error Error "+err);
        }
        else
        {
            console.error(err);
        }
    });
    
});

// route.get("/images/:filename",(req,res)=>{
//     //Take Filename
//     const filename = req.params.filename;
//     console.log(req.params);

//     //Firebase Storage Reference
//     const storageRef = storage.ref();
//     //Get File
//     storageRef.child("Images/"+filename).getDownloadURL().then((url) =>{

//         //Download the file through Storage
//         https.get(url,(r)=>{

//             //Read File
//             const fileStream = fs.createWriteStream("./downloads/"+filename);
//             r.pipe(fileStream);
//             fileStream.on("error",e=>{
//                 console.log(e.message);
//             });
//             fileStream.on("finish",()=>{
//                 fileStream.close();

//                 //Decrypt the File
//                 filedecryptImg(filename);
//                 console.log("abhi");
//                 fs.rmSync('./downloads/'+filename);
//             });
//         })
//     }).catch((err)=>{
//         if(err === null)
//         {
//             console.error("Error Error "+err);
//         }
//         else
//         {
//             console.error(err);
//         }
//     });
    

// });

route.get("/images/:filename",async(req,res)=>{
    try{
        const filename = req.params.filename;
        const storageRef = storage.ref();
        const url = await storageRef.child("Images/"+filename).getDownloadURL();
        https.get(url,(r)=>{
            const fileStream = fs.createWriteStream('downloads/'+filename);
            r.pipe(fileStream);
            fileStream.on("error",(e)=>{
                console.log(e.message);
            });
            fileStream.on("finish",()=>{
                fileStream.close();
                console.log("hello");
                filedecryptimg("downloads/"+filename);
                console.log("hello");
                fs.rmSync('downloads/'+filename);
            });
        });
    }
    catch(e){
        console.log(e.message);
    }
})


//Upload Endpoint
route.post("/documents/",(req,res)=>{

   
    //Check if file received
    if(req.files === null)
    {
        return res.status(400).json({msg:"No file uploaded"});
    }

    //File reference
    const file = req.files.file;
    const user = req.body.user;
    const file_name = user+"."+file.name.split('.')[1];

    //Move file to Folder
    file.mv('./uploads/'+file_name,err =>{
        if(err)
        {
            console.error(err);
            return res.status(500).send(err);
        }
        //Send sucess
        // res.json({fileName:file.name,
        //           filePath:"/uploads/${file.name}"});

        //Read file to Encrypt and Upload
        //Encrypt the file
        fileencrypt('./uploads/'+file_name);
        //Upload the File
        const storageRef = storage.ref();
        const fileRef = storageRef.child("Documents/"+file_name);
        
        const f = fs.readFileSync('./uploads/'+file_name);
        
        fileRef.put(f).then((snapshot) =>{
            console.log("Uploaded "+snapshot.bytesTransferred/(1e+6)+" MB Transferred!");

        }).catch((err)=>{
            console.dir(err.message);
        });

        //Delete the File
        fs.rmSync('./uploads/'+file_name);

        res.json({fileName:file.name,
                  filePath:"/uploads/${file.name}"});

    });
});

route.post("/images/",(req,res)=>{

    if(req.files === null)
    {
        return res.status(400).json({msg:"No file uploaded"});
    }

    //File reference
    const file = req.files.file;
    const user = req.body.user;
    const file_name = user+"."+file.name.split('.')[1];

    //Move file to Folder
    file.mv('uploads/'+file_name,err =>{
        if(err)
        {
            console.error(err);
            return res.status(500).send(err);
        }
        fileencrypt('uploads/'+file_name);
        
        //Upload the File
        const storageRef = storage.ref();
        const fileRef = storageRef.child("Images/"+file_name);
        
        const f = fs.readFileSync('uploads/'+file_name);
        
        fileRef.put(f).then((snapshot) =>{
            console.log("Uploaded "+snapshot.bytesTransferred/(1e+6)+" MB Transferred!");

        }).catch((err)=>{
            console.dir(err.message);
        });

        //Delete the File
        fs.rmSync('uploads/'+file_name);
        res.json({
            fileName:file_name,
            filePath:`/downloads/Images/${file_name}`
        });

    });
});

route.delete("/images/:filename",async(req,res)=>{
    try{
        const fileName = req.params.filename;
        const storageRef = storage.ref();
        const fileRef = storageRef.child("Images/"+fileName);
        await fileRef.delete();
        res.json({msg:"image deleted"})
    }
    catch(e){
        console.log(e.message);
    }
});

route.delete("/documents/:filename",async(req,res)=>{
    try{
        const fileName = req.params.filename;
        const storageRef = storage.ref();
        const fileRef = storageRef.child("Documents/"+fileName);
        await fileRef.delete();
        res.json({msg:"image deleted"})
    }
    catch(e){
        console.log(e.message);
    }
})


module.exports = route;
