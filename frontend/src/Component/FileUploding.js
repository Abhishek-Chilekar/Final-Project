import axios from 'axios';

export const submit = async(e) => {
    e.preventDefault();
        
        const formData = new FormData();
        formData.append('file',file);
        formData.append('user',1);
        console.log("Here");
        try
        {
            console.log("Here 2");
            const res = await axios.post('http://localhost:5000/documents',formData,{
                headers:{
                    'Content-type':'multipart/form-data'
                }
            });

            setUploadedFile(res.data);
        }
        catch(err)
        {
            console.log("Error "+err);
        }
}

export const submitImage = async(e) => {
    e.preventDefault();
        
        const formData = new FormData();
        formData.append('file',file);
        formData.append('user',2);
        console.log("Here");
        try
        {
            console.log("Here 2");
            const res = await axios.post('http://localhost:5000/images',formData,{
                headers:{
                    'Content-type':'multipart/form-data'
                }
            });

            setUploadedFile(res.data);
        }
        catch(err)
        {
            console.log("Error "+err);
        }
}

export const upload = async e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);   
}
    /**
     * Download the file give the filename and its extension carefully
     * @param {Event} e 
     */
export const download = async e =>{
    e.preventDefault();
    axios({
        //The link 
        url:`http://localhost:5000/${uploadedFile.fileName}`,
        method:"GET",
        responseType:"blob"
    }).then((res)=>{
        const fileDownload = require('js-file-download');
        //Give the Requested File name here
        fileDownload(res.data,`${uploadedFile.fileName}`);
    }).catch(err=>{
        console.log(err);
    });
    // await axios.get("http://localhost:5000/RationCard.pdf").then(e=>{
    //     console.log(60);
    // }).catch(err=>{
    //     console.log(err);
    // });
}

export const fetchImage = async e =>{
    e.preventDefault();
    try{await axios.get("http://localhost:5000/images/2.jpg");}
    catch(e){console.log(e.message)}
    
}
