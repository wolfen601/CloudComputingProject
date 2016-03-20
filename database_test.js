var date = new Date();
var database = require('./database.js')

// can't insert arrays ... yet
var conferenceData = {
    "Id":123456,
    "Acronym":"Tt",
    "Name":"Test",
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
};

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