var aws = require('aws-sdk');
//need to load IAM user with region to work with dynamodb

/************ LOCAL CONFIG *********************/
//aws.config.loadFromPath('aws-config.json');


/************ HEROKU CONFIG *********************/
var accessKeyId =  process.env.AWS_ACCESS_KEY || "XXXXXXXXXXXX";
var secretAccessKey = process.env.AWS_SECRET_KEY || "XXXXXXXXXXXXX";
aws.config.update({
 "accessKeyId": accessKeyId,
 "secretAccessKey": secretAccessKey,
 "region": "us-east-1"
});

var dynamodb = new aws.DynamoDB();
var docClient = new aws.DynamoDB.DocumentClient();


var deleteTables = function (callback){
    var params = {
        TableName : "Conferences"
    }

    dynamodb.deleteTable(params, function(err, data) {
        if (err)
            return callback(err,null);
        else
            return callback(null,JSON.stringify(data, null, 2));
    });

    var params = {
        TableName : "Users"
    }

    dynamodb.deleteTable(params, function(err, data) {
        if (err)
            return callback(err,null);
        else
            return callback(null,JSON.stringify(data, null, 2));
    });
}

var createTables = function(callback){
    //Conference Table
    // note that tables can only have two keys, one hash for Id's and one range for sorting
    // when inserting data, more columns can be added to data than is defined (NoSQL, duh)
    var params = {
        TableName : "Conferences",
        KeySchema: [
            {AttributeName: "Acronym", KeyType: "HASH"}//when there is only one key, that key is used as partition and range key
        ],
        AttributeDefinitions: [
            { AttributeName: "Acronym", AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    };
    //need to have dynamodb module in order to work
    dynamodb.createTable(params, function(err, data) {
        if (err)
            return callback(err,null);
        else
            return callback(null,JSON.stringify(data, null, 2));
    });

    //Users Table
    var params = {
        TableName : "Users",
        KeySchema: [
            { AttributeName: "User", KeyType: "HASH" }//when there is only one key, that key is used as partition and range key
        ],
        AttributeDefinitions: [
            { AttributeName: "User", AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    };

    dynamodb.createTable(params, function(err, data) {
        if (err)
            return callback(err,null);
        else
            return callback(null,JSON.stringify(data, null, 2));
    });


}

var insertConference = function (conference, callback){
    conference = orderReviews(conference);

    var params = {
        TableName: "Conferences",
        Item: conference
    };

    docClient.put(params, function(err, data) {
        if (err)
            callback(err,null);
        else
            callback(null,"Success");
    });
}

var insertUser = function (user, callback){
    var params = {
        TableName: "Users",
        Item: user
    };

    docClient.put(params, function(err, data) {
        if (err)
            callback(err,null);
        else
            callback(null,"Success");
    });
}

var getConference = function (conference, callback){
        var params = {
            TableName: "Conferences",
            Key: {
                "Acronym": conference.Acronym
            }
        };

        docClient.get(params, function(err, data) {
            if (err)
                callback(err,null);
            else
            //return conference
                callback(null,data.Item);
        });
}

var getConferenceByName = function(conference,conferenceList,callback){
    var name = conference.FullName;
    var data = null;
    for (var x = 0; x < conferenceList.length; x++){
        var conferenceInList = conferenceList[x];
        if(conferenceInList.FullName == name){
            data = conferenceInList;
            break;
        }
    }
    if (data == null)
        callback("Did not find conference by name.",null);
    else
    //return conference
        callback(null,data);

}

var getUser = function (user, callback){
    var params = {
        TableName: "Users",
        Key: {
            "User": user.User
        }
    };

    docClient.get(params, function(err, data) {
        if (err)
            callback(err,null);
        else
        //return user
            callback(null,data.Item);
    });
}


var getAllConferences = function (callback){
    var params = {
        TableName: "Conferences",
    };

    docClient.scan(params, function(err, data) {
        if (err)
            callback(err,null);
        else
        //return conferences
            callback(null,data.Items);
    });
}

var getAllUsers = function (callback){
    var params = {
        TableName: "Users",
    };

    docClient.scan(params, function(err, data) {
        if (err)
            callback(err,null);
        else
        //return users
            callback(null,data.Items);
    });
}


var deleteConference = function (conference, callback){
    var params = {
        TableName: "Conferences",
        Key: {
            "Acronym": conference.Acronym
        }
    };

    docClient.delete(params, function(err) {
        if (err)
            callback(err,null);
        else
            callback(null,"Success");
    });
}

var updateConference = function(conference,callback){
    var params = {
        TableName: "Conferences",
        Key: {
            "Acronym": conference.Acronym
        }
    };

    //having trouble with using the update function, so delete then insert instead of update
    docClient.delete(params, function(err) {
        if (err)
            callback(err,null);
        else {
            insertConference(conference, function (error) {
                if (error) {
                    callback(error,null);
                }
                else {
                    //successfully inserted
                    callback(null,"Success");
                }
            });
        }

    });
}

var updateAccount = function(account,callback){
    var params = {
        TableName: "Users",
        Key: {
            "User": account.User
        }
    };

    //having trouble with using the update function, so delete then insert instead of update
    docClient.delete(params, function(err) {
        if (err)
            callback(err,null);
        else {
            insertUser(account, function (error) {
                if (error) {
                    callback(error,null);
                }
                else {
                    //successfully inserted
                    callback(null,"Success");
                }
            });
        }

    });
}

var addSecondaryIndex = function(callback){
    var params = {
        TableName: "Conferences",
        AttributeDefinitions:[
            {AttributeName: "Name", AttributeType: "S"}
        ],
        GlobalSecondaryIndexUpdates: [
            {
                Create: {
                    IndexName: "NameIndex",
                    KeySchema: [
                        {AttributeName: "Name", KeyType: "HASH"}
                    ],
                    Projection: {
                        "ProjectionType": "ALL"
                    },
                    ProvisionedThroughput: {
                        "ReadCapacityUnits": 1,"WriteCapacityUnits": 1
                    }
                }
            }
        ]
    };

    dynamodb.updateTable(params, function(err, data) {
        if (err)
            callback(JSON.stringify(err, null, 2));
        else
            callback(JSON.stringify(data, null, 2));
    });
}

function compare(a,b) {
    if (a.Year < b.Year)
        return -1;
    else if (a.Year > b.Year)
        return 1;
    else
        return 0;
}

var orderReviews = function(conference){
    if(typeof conference.Reviews != "undefined"){
        conference.Reviews.sort(compare);
    }

    return conference;
}

var numberOfReviews = function(account,callback){
    var count = 0;
    var userName = account.User;
    getAllConferences(function(error, data){
        if(error){
            callback(error,null);
        }
        else{
            var conferenceList = data;
            //fml three nested loops
            for(var x = 0; x < conferenceList.length; x++){
                var conference = conferenceList[x];
                if(typeof conference.Reviews != "undefined"){
                    //reviews exist
                    for(var y = 0; y < conference.Reviews.length; y++){
                        for(var z = 0; z < conference.Reviews[y].Review.length; z++){
                            if(conference.Reviews[y].Review[z].User.toLowerCase() == userName.toLowerCase()){
                                //user in review match
                                count++;
                            }
                        }
                    }
                }
            }
            callback(null,count);
        }
    });
}

module.exports = {
    deleteTables: deleteTables,
    createTables: createTables,
    addSecondaryIndex: addSecondaryIndex,
    insertConference: insertConference,
    insertUser: insertUser,
    getConference: getConference,
    getConferenceByName: getConferenceByName,
    getUser: getUser,
    getAllConferences: getAllConferences,
    getAllUsers: getAllUsers,
    deleteConference: deleteConference,
    updateConference: updateConference,
    updateAccount: updateAccount,
    orderReviews : orderReviews,
    numberOfReviews: numberOfReviews
}
