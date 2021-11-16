import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express=require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs=require('fs');
// import { urlencoded } from 'body-parser';
// import fileUpload from 'express-fileupload';
// import { unlink, readFileSync } from 'fs';
import { join } from "path";
//const ipfs = new ipfsClient({host : 'localhost', port : '5001',protocol : 'http'});
import * as IPFS from 'ipfs-core'

const ipfs = await IPFS.create()
// const { cid } = await ipfs.add('Hello world')
// console.info(cid)
const app=express();


// app.set("views",join(__dirname,"views"))
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());


app.get('/',(req,res)=>{
    res.render('home');
});


app.post('/upload',(req,res)=>{
    const file=req.files.file;
    const fileName =req.body.fileName;
    const filePath ='files/' + fileName;

    file.mv(filePath,async(err)=>{
        if(err){
            console.log('Error : failed to download the file');
            return res.status(500).send(err);
        }

        const fileHash =await addFile(fileName,filePath);
        fs.unlink(filePath,(err)=>{
            if(err) console.log(err);
        });
        console.log("FileHash2 is ",fileHash);
        res.render('upload',{fileName,fileHash});
    });
});

//app.use('/upload', express.static('upload'));
const addFile = async(fileName,filePath) =>{
    const file= fs.readFileSync(filePath);
    const {cid} = await ipfs.add({path :fileName,content : file});
    const fileHash = cid
    console.log("Yoyo FileHash is ",fileHash);
    return fileHash;
}


app.listen(3000,()=>{
    console.log('Server running at localhost 3000');
})