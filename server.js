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
var conferenceList = null;
database.getAllConferences(function(error, data){
    if(error){
        console.log(error);
    }
    else{
        conferenceList = data;
    }
});



//on successful connection from client to server
io.on('connection', function (socket) {
    //load user
    socket.on('load', function(data){
        //creates a private socket connection
        var user = data.username;
        socket.join(data.username);
        //initialize the user and send them a list of the conference names
        io.sockets.in(user).emit('initialize', { conferences: conferenceList} );
    });

    //add reviews
    socket.on('createReview', function(data){
        //user
        var user = data.id;
        //conference name
        var conference = {"Acronym":data.Acronym};
        //review data
        var review = data.review;

        database.getConference(conference, function(error, data){
            if(error){
                console.log(error);
            }
            else{
                // got conference returned
                var conference = data;

                if (typeof conference.Reviews == 'undefined') {
                    //no review are added
                    conference.Reviews = [review];
                }
                else{
                    //reviews exist, append
                    conference.Reviews.push(review);
                }
                database.updateConference(conference, function(error, data){
                    if(error){
                        console.log(error);
                    }
                    else{
                        //emit results
                        io.sockets.in(user).emit('createReviewResult', { results: conference} );
                    }
                });
            }
        });
    });
    //edit reviews
    socket.on('editReview', function(data){
        //user
        var user = data.id;
        //conference name
        var conference = {"Acronym":data.name};
        //review data
        var review_edited = data.review;
        //get conference to edit review
        database.getConference(conference, function(error, data){
            if(error){
                console.log(error);
            }
            else{
                // got conference returned
                var conference = data;
                //reviews exist, edit review in reviews
                for(var x = 0; x < conference.Reviews.length; x++){
                    var review = conference.Reviews[x];
                    //if the year and the users are the same, update the conference with the edited review
                    if(review.Year == review_edited.Year && review.Review.User == review_edited.Review.User){
                        conference.Reviews[x] = review_edited;
                        break;
                    }
                }
                database.updateConference(conference, function(error, data){
                    if(error){
                        console.log(error);
                    }
                    else{
                        //emit results
                        io.sockets.in(user).emit('editReviewResult', { results: conference} );
                    }
                });
            }
        });
    });
    //edit account
    socket.on('editAccount', function(data){
        //user
        var user = data.id;
        //account data
        var accountData = data.account;

        database.updateAccount(accountData, function(error, data)
        {
            if(error){
                console.log(error);
            }
            else{
                //emit results
                io.sockets.in(user).emit('editAccountResult', { results: accountData} );
            }
        });
    });
    //add conference
    socket.on('addConference', function(data){
        //user
        var user = data.id;
        //account data
        var conference = data.conference;
        conferenceList.push(conference);

        database.insertConference(conferenceData, function(error, data){
            if(error){
                console.log(error);
            }
            else{
                //emit results
                io.sockets.in(user).emit('addConferenceResult', { results: conferenceList} );
            }
        });
    });
    //edit conference
    socket.on('editConference', function(data){
        //user
        var user = data.id;
        //conference data
        var conference = {"Acronym":data.name};
        database.updateConference(conference, function(error, data){
            if(error){
                console.log(error);
            }
            else{
                //emit results
                io.sockets.in(user).emit('editConferenceResult', { results: conference} );
            }
        });
    });
    //socket query
    socket.on('queryConference', function(data){
        var user = data.id;
        //conference data
        var conference = {"Acronym":data.name};
        database.getConference(conference, function(error, data){
            //could not query conference by acronym, try querying by full name
            if(error){
                database.getConferenceByName(conference,conferenceList, function(error, data){
                    if(error){
                        console.log(error);
                    }
                    else{
                        // got conference returned
                        var conference = data;
                        io.sockets.in(user).emit('queryResult', { message: conference });
                    }
                });
                console.log(error);
            }
            else{
                // got conference returned
                var conference = data;
                io.sockets.in(user).emit('queryResult', { message: conference });
            }
    });

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
    database.getAllConferences(function(error, data){
        if(error){
            console.log(error);
        }
        else{
            conferenceList = data;
        }
    });
}
