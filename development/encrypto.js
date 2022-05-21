const cryptojs = require('crypto-js');
const fs = require('fs');

const IV = "9De0DgMTCDFGNokdEEial";
const password = "nvjnjzLD35275yv4t932fefj";
const key = "SECRET";

/**
 * Text Encryption
 * @param {string} text Text to encrypt
 */
function textencrypt(text)
{
    const cipher = cryptojs.AES.encrypt(text,password);
    const edata = cipher.toString();
    return edata;
}

/**
 * Text Decryption
 * @param {string} cipher cipher text
 */
function textdecrypt(cipher)
{
    const decipher = cryptojs.AES.decrypt(cipher,password);
    return decipher.toString(cryptojs.enc.Utf8);
}

/**
 * File Encryption
 */
function fileencrypt(filepath)
{
    const dataFile = fs.readFileSync(filepath),
    database64 = dataFile.toString('base64'),
    encryptFile = cryptojs.AES.encrypt(database64,key,{iv:IV}),
    buffer = new Buffer(encryptFile.toString(),'base64');
    fs.writeFileSync(filepath,buffer);
}

/**
 * File Decryption
 */
function filedecrypt(filepath)
{
    
    const datafile = fs.readFileSync(filepath);
    const decryptFile = cryptojs.AES.decrypt(datafile.toString('base64'),key,{iv:IV});

    const result = decryptFile.toString(cryptojs.enc.Utf8);
    const buffer = new Buffer(result,'base64');
    fs.writeFileSync(filepath,buffer);
}

function filedecryptimg(filepath)
{
    const dataFile = fs.readFileSync("downloads/"+filepath);
    const decryptFile = cryptojs.AES.decrypt(dataFile.toString('base64'),kay,{iv:IV});
    const result = decryptFile.toString(cryptojs.enc.Utf8);
    const buffer = new Buffer(result,'base64');
    fs.writeFileSync("downloads/Images/"+filepath,buffer);
}

module.exports = [textencrypt,textdecrypt,fileencrypt,filedecrypt,filedecryptimg];