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
            "Year": "2017",
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
                },
                {
                    "User": "Rob",
                    "CreatedOn": date.getDate()  + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear(),
                    "Rating": "8",
                    "Details": "Sub par"
                }
            ]
        }
    ]
};

var accountData = {
    "User":"neil",
    "Password":"seward",
    "Id":0
};

////var conferenceList = null;
//database.getAllConferences(function(error, data){
//    if(error){
//        console.log(error);
//    }
//    else{
//        conferenceList = data;
//        database.getConferenceByName(conferenceData,conferenceList,function(error, data)
//        {
//            if(error){
//                console.log(error);
//            }
//            else{
//                // got conference returned
//                var conference = data;
//                console.log(conference);
//            }
//        });
//    }
//});

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

//database.addSecondaryIndex(function(error, data){
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

//database.getConferenceByName(conferenceData,conferenceList,function(error, data)
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

//database.getUser(accountData, function(error, data)
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


//
//var conference = {"Acronym":"3DIM"};
////review data
//var review_edited = {
//    "Year": "2016",
//    "Review": [
//        {
//            "User": "Rob",
//            "CreatedOn": date.getDate()  + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear(),
//            "Rating": "6",
//            "Details": "Meh. I could have done better"
//        }
//    ]
//};
////get conference to edit review
//
//database.getConference(conference, function(error, data){
//    if(error){
//        console.log(error);
//    }
//    else{
//        // got conference returned
//        var conference = data;
//        //reviews exist, edit review in reviews
//        for(var x = 0; x < conference.Reviews.length; x++){
//            var review = conference.Reviews[x];
//
//            for(var y = 0; y < review.Review.length; y++){
//                var reviewByYear = review.Review[x];
//                //if the year and the users are the same, update the conference with the edited review
//
//                if(reviewByYear.Year == review_edited.Year && reviewByYear.User == review_edited.Review.User){
//                    conference.Reviews[x] = review_edited;
//                    break;
//                }
//            }
//
//        }
//        database.updateConference(conference, function(error, data){
//            if(error){
//                console.log(error);
//            }
//            else{
//                //emit results
//                console.log("Success");
//            }
//        });
//    }
//});

//database.orderReviews(conferenceData);

//database.numberOfReviews(accountData);
