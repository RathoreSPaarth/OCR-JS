const express = require('express')
const app = express()
const ejs = require('ejs')
const multer = require('multer')
const fs = require('fs')
// const { createWorker } = require("tesseract.js")
// const worker = new createWorker({
// logger: m => console.log(m)
// });
////
//setting up tesseract
const {TesseractWorker} = require('tesseract.js')
const worker = new TesseractWorker();

const port = 3000
//setting up view engine
app.set('view engine','ejs')

//static path for css
app.use(express.static('views'))

//multer for uploading files
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'./uploads')
    },
    filename: (req,file,cb) => {
        cb(null,file.originalname)
    } 
})
 const upload = multer({
     storage: storage
 }).single("uploaded")

 //routing-GET
app.get('/',(req,res,err)=>{
    if(err){
        console.log(err)
    }
    res.render('index.ejs')
})
//console.log('pls work!')

//routing-POST
app.post('/',(req,res,err)=>{
  upload(req,res,err => {
      console.log('done!')
  })
  res.redirect('/')
})


//SETTING UP SERVER
app.listen(port);