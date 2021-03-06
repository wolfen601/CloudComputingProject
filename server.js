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
//API for bar chart plotting
var plotly = require('plotly')("sealneaward", "tt2lczxubi");
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

//aws.config.loadFromPath('aws-config.json');

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
        var user = {"User":data.username};
        socket.join(data.username);

        database.getUser(user, function(error, data)
        {
            if(error){
                console.log(error);
            }
            else{
                // got account returned
                var account = data;
                var count = database.numberOfReviews(account,function(error,count){
                    if(error){
                        console.log(error);
                    }
                    else {
                        //initialize the user and send them a list of the conference names
                        io.sockets.in(user.User).emit('initialize', {
                            conferences: conferenceList,
                            info: account,
                            count: count
                        });
                    }
                });

            }
        });

    });

    //add reviews
    socket.on('createReview', function(data){
        //user
        var user = data.id;
        //conference name
        var conference = {"Acronym":data.Acronym};
        //review data
        var review = data.Reviews;

        database.getConference(conference, function(error, data){
            if(error){
                console.log(error);
            }
            else{
                // got conference returned
                var conference = data;

                //if no reviews exist
                if (typeof conference.Reviews == 'undefined') {
                    //no reviews are added, ignore year
                    conference.Reviews = [];
                    conference.Reviews.push(review);
                    //conference.Reviews.Review = [review];
                }
                else{
                    //reviews exist, append to current year (if exists)
                    var foundYear = false;
                    for(var x = 0; x < conference.Reviews.length; x++){
                        var existingReview = conference.Reviews[x];
                        if(existingReview.Year == review.Year)
                        {
                            conference.Reviews[x].Review.push(review.Review.pop());
                            foundYear = true;
                            break;
                        }
                    }
                    if(foundYear == false){
                        conference.Reviews.push(review);
                    }
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
        var review_edited = data.Reviews;
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

                    for(var y = 0; y < review.Review.length; y++){
                        var reviewByYear = review.Review[y];
                        //if the year and the users are the same, update the conference with the edited review

                        if(reviewByYear.Year == review_edited.Year && reviewByYear.User == review_edited.Review.User){
                            conference.Reviews[x].Review[y] = review_edited;
                            break;
                        }
                    }

                }
                database.updateConference(conference, function(error, data){
                    if(error){
                        console.log(error);
                    }
                    else{
                        //emit results
                        console.log("Success");
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
        var conference = data.conference;
        conference.Acronym = data.name;

        database.getConference(conference, function(error, data){
            if(error){
                console.log(error);
            }
            else{
                // got conference returned
                conference.FullName = data.FullName;
                conference.Reviews = data.Reviews;
                database.updateConference(conference, function(error, data){
                    if(error){
                        console.log(error);
                    }
                    else{
                        //emit results
                        io.sockets.in(user).emit('editConferenceResult', { results: conference} );
                    }
                });
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
    //logout user
    socket.on('logout', function(data){
        var user = data.user;
        database.updateAccount(user, function(error, data)        {
            if(error){
                console.log(error);
            }
            else{
                console.log("Updated user.");
            }
        });
    });

    //get average conference ratings and create bar plot
    socket.on('analytics', function(data){
        var user = data.user;
        graphConferences(function(conferenceUrl){
            graphUserRatings(function(userURL){
                io.sockets.in(user).emit('analyticsResult', { conferenceGraph: conferenceUrl, userGraph: userURL });
            });
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

function getAverageRatings(conferenceList, callback){
    var conferencesWithRating = [];
    for(var x = 0; x < conferenceList.length; x++){
        var conference = conferenceList[x];
        var count = 0;
        var totRating = 0;
        if(typeof conference.Reviews != "undefined"){
            //reviews exist
            for(var y = 0; y < conference.Reviews.length; y++){
                for(var z = 0; z < conference.Reviews[y].Review.length; z++){
                    count++;
                    totRating += parseInt(conference.Reviews[y].Review[z].Rating);
                }
            }
            //calculate average;
            conference.AverageRating = totRating/count;
            conferencesWithRating.push(conference);
        }
    }
    callback(conferencesWithRating);
}

function ratingsForUsers(conferenceList,userList, callback){
    var usersWithRating = [];
    for(var u = 0; u < userList.length; u++){
        var user = userList[u];
        var count = 0;
        var totRating = 0;

        for(var x = 0; x < conferenceList.length; x++) {
            var conference = conferenceList[x]
            if(typeof conference.Reviews != "undefined") {
                //reviews exist
                for (var y = 0; y < conference.Reviews.length; y++) {
                    for (var z = 0; z < conference.Reviews[y].Review.length; z++) {
                        var review = conference.Reviews[y].Review[z];
                        if (review.User.toLowerCase() == user.User.toLowerCase()) {
                            count++;
                            totRating += parseInt(review.Rating);
                        }
                    }
                }
            }
        }
        if(count > 0){
            user.AverageRating = totRating/count;
        }
        else{
            user.AverageRating = 0;
        }
        usersWithRating.push(user);

    }
    callback(usersWithRating);
}

function graphUserRatings(callback){
    database.getAllConferences(function(error, conferenceList){
        if(error){
            console.log(error);
        }
        else{
            database.getAllUsers(function(error, userList){
                if(error){
                    console.log(error);
                }
                else{
                    ratingsForUsers(conferenceList, userList,function(userList){
                        var names = [];
                        var ratings = [];
                        for(var x = 0; x < userList.length; x++){
                            var user = userList[x];
                            names.push(user.User);
                            ratings.push(user.AverageRating);
                        }


                        var data = [
                            {
                                x: names,
                                y: ratings,
                                type: "bar"
                            }
                        ];
                        var layout = {
                            title: 'Average Rating Per User',
                            xaxis: {
                                title: 'User Name',
                                titlefont: {
                                    family: 'Courier New, monospace',
                                    size: 18,
                                    color: '#7f7f7f'
                                }
                            },
                            yaxis: {
                                title: 'Average Rating Given',
                                titlefont: {
                                    family: 'Courier New, monospace',
                                    size: 18,
                                    color: '#7f7f7f'
                                }
                            },
                            autosize: false,
                            height: 500,
                            width: 750
                        };
                        var graphOptions = {layout: layout, filename: "styling-names", fileopt: "overwrite"};
                        plotly.plot(data, graphOptions, function (err, msg) {
                            if(err){
                                console.log(error);
                            }
                            else {
                                var url = msg.url + '.embed'
                                callback(url);
                            }

                        });
                    });
                }
            });
        }
    });
}

function graphConferences(callback){
    database.getAllConferences(function(error, conferenceList){
        if(error){
            console.log(error);
        }
        else{
            getAverageRatings(conferenceList,function(conferenceList){
                var names = [];
                var ratings = [];
                for(var x = 0; x < conferenceList.length; x++){
                    var conference = conferenceList[x];
                    names.push(conference.Acronym);
                    ratings.push(conference.AverageRating);
                }


                var data = [
                    {
                        x: names,
                        y: ratings,
                        type: "bar"
                    }
                ];
                var layout = {
                    title: 'Average Rating Per Conference',
                    xaxis: {
                        title: 'Conference Name',
                        titlefont: {
                            family: 'Courier New, monospace',
                            size: 18,
                            color: '#7f7f7f'
                        }
                    },
                    yaxis: {
                        title: 'Average Rating',
                        titlefont: {
                            family: 'Courier New, monospace',
                            size: 18,
                            color: '#7f7f7f'
                        }
                    },
                    autosize: false,
                    height: 500,
                    width: 750
                };
                var graphOptions = {layout:layout,filename: "conferences", fileopt: "overwrite"};
                plotly.plot(data, graphOptions, function (err, msg) {
                    if(err){
                        console.log(err);
                    }
                    else {
                        var url = msg.url + '.embed'
                        callback(url);
                    }

                });
            });
        }
    });
}
