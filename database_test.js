var date = new Date();
var database = require('./database.js');
var conferences = require('./info/conferences.json');
var users = require('./info/users.json');
var conference = conferences[0];
var user = users[0];

// cannot insert Name column (specially reserved)
var conferenceData = {
    "Id":conference.Id,
    "Acronym":conference.Acronym,
    "FullName":conference.FullName,
    "LastEditedOn": date.getDate()  + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear(),
    "Description":"This is a test conference.",
    "Organization":conference.Organization,
    "Reviews":[
        {
            "Year": "1993",
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
};

var accountData = {
    "User":"admin",
    "Password":"root",
    "Id":0
};

////insert all conferences into database
////after testing, only 616 conferences can be inserted before getting a throughput error (we are inserting to much, too quick)
//for (var x = 0; x < conferences.length; x++){
//    var conference = conferences[x];
//
//    database.insertConference(conference, function(error, data){
//        if(error){
//            console.log(error);
//        }
//        else{
//            //successfully inserted
//            console.log("Inserted: "+x+" conferences." );
//        }
//    });
//
//}

////insert all users
//for (var x = 0; x < users.length; x++){
//    var user = users[x];
//
//    database.insertUser(user, function(error, data){
//        if(error){
//            console.log(error);
//        }
//        else{
//            //successfully inserted
//            console.log(data);
//        }
//    });
//
//}

//database.getAllConferences(function(error, data){
//    if(error){
//        console.log(error);
//    }
//    else{
//        console.log(data);
//    }
//});

//database.getAllUsers(function(error, data){
//    if(error){
//        console.log(error);
//    }
//    else{
//        console.log(data);
//    }
//});

//database.deleteTables(function(error, data){
//    if(error){
//        console.log(error);
//    }
//    else{
//        console.log(data);
//    }
//});


//database.createTables(function(error, data){
//    if(error){
//        console.log(error);
//    }
//    else{
//        console.log(data);
//    }
//});

//database.insertConference(conferenceData, function(error, data)
//{
//    if(error){
//        console.log(error);
//    }
//    else{
//        //successfully inserted
//        console.log(data);
//    }
//});

//database.insertUser(user, function(error, data){
//    if(error){
//        console.log(error);
//    }
//    else{
//        //successfully inserted
//        console.log(data);
//    }
//});

//database.getConference(conferenceData, function(error, data)
//{
//    if(error){
//        console.log(error);
//    }
//    else{
//        // got conference returned
//        var conference = data;
//        console.log(conference);
//    }
//});

//database.getUser(user, function(error, data)
//{
//    if(error){
//        console.log(error);
//    }
//    else{
//        // got conference returned
//        var user = data;
//        console.log(user);
//    }
//});

//database.deleteConference(conferenceData, function(error, data)
//{
//    if(error){
//        console.log(error);
//    }
//    else{
//        // got conference returned
//        var conference = data;
//        console.log(conference);
//    }
//});

//database.updateConference(conferenceData, function(error, data)
//{
//    if(error){
//        console.log(error);
//    }
//    else{
//        // got conference returned
//        var conference = data;
//        console.log(conference);
//    }
//});

//database.updateAccount(user, function(error, data)
//{
//    if(error){
//        console.log(error);
//    }
//    else{
//        // got conference returned
//        var user = data;
//        console.log(user);
//    }
//});