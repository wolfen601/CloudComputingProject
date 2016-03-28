/* Author: Kevin Ho
 * Server file
 * Handles communication with the storage service as well as emitting messages
 * to all clients.
*/
/***************
 * Initialize  *
***************/
//initialize all the required libraries and connections
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    http = require('http'),
    socketIo = require('socket.io'),
    aws = require('aws-sdk'),
    path = require('path');
var server = http.createServer(app);
var database = require('./database.js');
var io = socketIo.listen(server);
var port = process.env.PORT || 8080;
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//List of all users currently on and conferences
var users = {};
var conferenceList = {};
//loadConferences();


/*******************
 * AWS Initialize  *
*******************/
var accessKeyId =  process.env.AWS_ACCESS_KEY || "XXXXXXXXX";
var secretAccessKey = process.env.AWS_SECRET_KEY || "XXXXXXXXXX";
var s3bucket = process.env.S3_BUCKET || "xxxxxxx";
var table = "Users";
//aws.config.update({
//  accessKeyId: accessKeyId,
//  secretAccessKey: secretAccessKey,
//  region: "us-west-2"
//});

aws.config.loadFromPath('aws-config.json');

var docClient = new aws.DynamoDB.DocumentClient({
      params: {
        endpoint:  "https://dynamodb.us-west-2.amazonaws.com"
      }
});

// //set the desired s3 bucket to use
var s3 = new aws.S3({
      params: {
        Bucket: s3bucket,
        endpoint:  "https://s3.us-west-2.amazonaws.com"
      }
});

/***************
 * Routing     *
***************/
//homepage

app.post('/login', function(req, res){
  var username = req.body.user.name;
  var password = req.body.user.passwd;
  var queryUser = {"User":username};
  database.getUser(queryUser,function(err, data) {
      if (err) {
          console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
          //should only have one user with name specified
          console.log("Query succeeded.");
          if(typeof data == 'undefined'){
              console.log("User does not exist.");
              res.redirect('/login');
          }
          else if(username == data.User && password == data.Password){
              res.redirect('/user/' + username);
          }else{
              console.log("Incorrect password.");
              res.redirect('/login');
          }
      }
  }) ;
});

app.post('/signup', function(req, res){
  var username = req.body.user.name;
  var password = req.body.user.passwd;
  var queryUser = {"User":username};
  if(username !== "" && username.toLowerCase() !== "guest" && password !== ""){
      database.getUser(queryUser, function(err, data) {
      if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
        console.log("Query succeeded.");
        if(typeof data == 'undefined'){
            console.log("User does not exist.");
            addNewUser(username, password);
            res.redirect('/user/' + username);
        }else{
            console.log("User exists.");
            res.redirect('/signup');
        }
      }
    });
  }else{
    console.log('Missing Username or Password.');
      res.redirect('/signup');
  }
});

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, '/views', 'home.html'));
});

app.get('/login', function(req, res){
	res.sendFile(path.join(__dirname, '/views', 'login.html'));
});

app.get('/search', function(req, res){
  res.sendFile(path.join(__dirname, '/views', 'search.html'));
});

app.get('/logout/:id', function(req, res){
  console.log('logout: ' + req.params.id);
  delete users[req.params.id];
	res.redirect('/');
});

app.get('/signup', function(req, res){
	res.sendFile(path.join(__dirname, '/views', 'signup.html'));
});

app.get('/user/:id', function(req, res){
	res.sendFile(path.join(__dirname, '/views', 'user.html'));
});

app.get('/guest', function(req, res){
  res.redirect('/user/guest');
});

/**********************
 * Start Application  *
***********************/
//start the application
server.listen(port);
console.log("Server running on 127.0.0.1:" + port);
var date = new Date();
var conferenceList = [
  {
    "Id":"123456",
    "Name":"Test",
    "Acronym":"Tt",
    "Rating":"5"
  },
  {
    "Id":"41",
    "Name":"Kevin",
    "Acronym":"Kn",
    "Rating":"10"
  },
  {
    "Id":"6365",
    "Name":"Neil Sewardo",
    "Acronym":"NSo",
    "Rating":"3"
  },
  {
    "Id":"234",
    "Name":"Raab",
    "Acronym":"Rbb",
    "Rating":"6"
  },
  {
    "Id":"7456",
    "Name":"Confer",
    "Acronym":"CD",
    "Rating":"1"
  },
  {
    "Id":"4325",
    "Name":"World Wildlife Foundation",
    "Acronym":"WWF",
    "Rating":"10"
  }
];
var conferenceData = [{
    "Id":"123456",
    "Name":"Test",
    "Acronym":"Tt",
    "LastEditedOn": date.getDate()  + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear(),
    "Description":"This is a test conference.",
    "Reviews":[
      {
        "Year": "2015",
        "Review": [
          {
            "User": "Kevin",
            "CreatedOn": date.getDate()  + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear(),
            "Rating": "5",
            "Details": "So bad"
          }
        ]
      },
      {
        "Year": "2016",
        "Review": [
          {
            "User": "Neil",
            "CreatedOn": date.getDate()  + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear(),
            "Rating": "10",
            "Details": "Stepped it up"
          }
        ]
      }
    ]
  }];
//on successful connection from client to server
io.on('connection', function (socket) {

  socket.on('load', function(data){
    //creates a private socket connection
    var user = data.username;
    socket.join(data.username);
    //initialize the user and send them a list of the conference names
    io.sockets.in(user).emit('initialize', { conferences: conferenceList} );
  });
  //socket query
  socket.on('queryConference', function(data){
    user = data.id;
    //TODO query conference S3 from database

    io.sockets.in(user).emit('queryResult', { message: conferenceData });
  });
  //TODO add and remove reviews using this
  socket.on('review', function(data){
    //conference name
    var conference = data.name;
    //review data
    var review = data.review;

  });
});
//adds new user to database
function addNewUser(username, password) {
  console.log("Adding a new user...");
    var user = {"User":username, "Password":password};
    database.insertUser(user, function(error, data){
        if(error){
            console.log(error);
        }
        else{
            //successfully inserted
            console.log("Added user");
            console.log(data);
        }
    });

}

function loadConferences(){
  //TODO query from dynamodb instead of s3
  var params = {
    Key: user + "-" + listId + ".json",
    ResponseContentType : 'application/json'
  };
  s3.getObject(params, function(errBucket, dataBucket) {
    if (errBucket) {
      console.log("Error downloading data: ", errBucket);
    } else {
      console.log("Success downloading data: ", dataBucket);
      taskList = JSON.parse(dataBucket.Body).tasks;
    }
    console.log('user: ' + user + '\n' + JSON.stringify(taskList));

  });
}
