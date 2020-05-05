const express = require('express')
const app = express()
const ejs = require('ejs')
const multer = require('multer')
const fs = require('fs')
var mysql      = require('mysql');
var unirest = require("unirest");

var req = unirest("GET", "https://edamam-food-and-grocery-database.p.rapidapi.com/parser");
var link
let temp
var k = 0
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
app.post('/details',(req,res,err)=>{
  upload(req,res,err => {
      //console.log('done!')
      fs.readFile(`./uploads/${req.file.originalname}` , (err,data) => {
          if(err) return console.log("error is",err);
    
          worker
           .recognize(data,"eng", {tess_js_pdf: "1"})
          .progress(progress => {
              console.log(progress)
          })
          .then(result => {
               var word = result.text;
               var arr = word.split("\n");
                var newArr = []

               for(var i = 0; i<arr.length; i++){
                   var character = arr[i].split(" ")
                   newArr.push(character)
               }

            finalArr = [].concat(...newArr);
            console.log(finalArr)
            temp = finalArr[0]
            console.log(typeof(temp))
            //res.redirect(link)
          }).then(temp=>{
            //console.log(finalArr[0])
            param = finalArr[0]
            api(param)
            // res.redirect(link)
            function red(){
                res.redirect(link)
            }
            setTimeout(red,3000)
            
          })
          //.finally(() => worker.terminate())
          
      })
  })

})

//api()

 function api(param){
                var i = "lays"
                req.query({
                    "ingr": `${param}`
                });
                
                req.headers({
                    "x-rapidapi-host": "edamam-food-and-grocery-database.p.rapidapi.com",
                    "x-rapidapi-key": "201594df46msh2bd5bd39dfa30f1p1d18c9jsn57e1cbc0afc3"
                });
                
                
                req.end(function (res) {
                    if (res.error) throw new Error(res.error);
                
                    link = (res.body._links.next.href);
                    console.log(link)
                });
                
            }


//SETTING UP SERVER
app.listen(port);
