const express = require("express");
const mysql = require("mysql2");
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})
app.listen(3000);

//DB接続
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "comment_app",
});

connection.connect((err) => {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  console.log("success");
});


//form
app.get("/", (req, res) => {
  res.render("./hello.ejs");
  res.end();
});




//GET処理
app.get("/api/", (req, res) => {
  connection.query("SELECT * FROM comments", (error, results) => {
    if (error) throw error;
    res.statusCode = 200;
    res.send(results);
    res.end();
  });
});

//POST処理
app.post("/api/", (req, res) => {
  // console.log(req);
  try {
    const query = "insert into comments set ?";
    connection.query(
      query,
      { nickname: req.body.nickname, comment: req.body.comment },
      (err, rows) => {
        if (err) res.end("fail");
        res.statusCode = 200;
        res.send("success");
        res.end();
      }
    );
  } catch (e) {
    // alert(e);
    res.end();
  }
});