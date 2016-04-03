var plotly = require('plotly')("sealneaward", "tt2lczxubi");
var database = require('./database.js');

//database.getAllConferences(function(error, conferenceList){
//    if(error){
//        console.log(error);
//    }
//    else{
//        getAverageRatings(conferenceList,function(conferenceList){
//            var names = [];
//            var ratings = [];
//            for(var x = 0; x < conferenceList.length; x++){
//                var conference = conferenceList[x];
//                names.push(conference.Acronym);
//                ratings.push(conference.AverageRating);
//            }
//
//
//            var data = [
//                {
//                    x: names,
//                    y: ratings,
//                    type: "bar"
//                }
//            ];
//            var graphOptions = {filename: "basic-bar", fileopt: "overwrite"};
//            plotly.plot(data, graphOptions, function (err, msg) {
//                var url = msg.url + '.embed'
//                console.log(url);
//
//            });
//        });
//    }
//});


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
                    var graphOptions = {filename: "basic-bar", fileopt: "overwrite"};
                    plotly.plot(data, graphOptions, function (err, msg) {
                        if(err){
                            console.log(error);
                        }
                        else {
                            var url = msg.url + '.embed'
                            console.log(url);
                        }

                    });
                });
            }
        });
    }
});



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
            if (count > 0) {
                conference.AverageRating = totRating / count;
            }
            else{
                conference.AverageRating = 0;
            }
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

