var express = require('express');
var app = express();
const con = require('./config.js');
var formidable = require('formidable');
var fs = require('fs');
var upload = require('express-fileupload');

//need to check database connection..............
con.connect((err)=> {if (err) throw err; });
//catch form data .........................
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
/*hendale and render .html file ..............
All file will be created inside public folder....*/
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use(upload());
//Route path................
app.get('/', (req, res)=>{
	let sql = "select * from customers "; 
    con.query(sql, (err, result)=> {
    if (err) throw err;
    res.render('customer.html',{data:result});
  });
});


app.get('/register', (req, res)=>{
    res.render('register.html');
});

app.post('/register', (req, res)=>{
	if(req.files.filetoupload){
    var file = req.files.filetoupload,
      name = file.name,
      type = file.mimetype;
    var uploadpath = __dirname + '/public/images/' + name;
    file.mv(uploadpath,function(err){
      if(err){
        console.log("File Upload Failed",name,err);
        res.send("Error Occured!")
      }
      else {
        console.log("File Uploaded",name);
        res.send('Done! Uploading files')
      }
    });
  }

/* let name = req.body.name;
 let address = req.body.address;
 let data = { name, address};
  con.query('INSERT INTO customers SET ?', data,(error, results, fields)=>{
      if (error) throw error;
      res.send('data inserted successfully');
    });*/
});

app.listen(4000);