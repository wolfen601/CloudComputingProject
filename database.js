var aws = require('aws-sdk');
//need to load IAM user with region to work with dynamodb
aws.config.loadFromPath('neil-aws-config.json');

var dynamodb = new aws.DynamoDB();
var docClient = new aws.DynamoDB.DocumentClient();

module.exports = {
    deleteTables: function (callback){
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
    },
    createTables: function(callback){
        //Conference Table
        // note that tables can only have two keys, one hash for Id's and one range for sorting
        // when inserting data, more columns can be added to data than is defined (NoSQL, duh)
        var params = {
            TableName : "Conferences",
            KeySchema: [
                { AttributeName: "Id", KeyType: "HASH" },  //Partition key
                { AttributeName: "Acronym", KeyType: "RANGE" }  //Sort key
            ],
            AttributeDefinitions: [
                { AttributeName: "Id", AttributeType: "N" },
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
                { AttributeName: "Id", KeyType: "HASH" },  //Partition key
                { AttributeName: "User", KeyType: "RANGE" }  //Sort key
            ],
            AttributeDefinitions: [
                { AttributeName: "Id", AttributeType: "N" },
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


    },
    insertConference: function (conference, callback){
        var params = {
            TableName: "Conferences",
            Item: conference
        };

        docClient.put(params, function(err, data) {
            if (err)
                callback(err,null);
            else
                callback(null,JSON.stringify(data, null, 2));
        });
    },
    getConference: function (conference, callback){
        var params = {
            TableName: "Conferences",
            Key: {
                "Id":conference.Id,
                "Acronym": conference.Acronym
            }
        };

        docClient.get(params, function(err, data) {
            if (err)
                callback(err,null);
            else
            //return conference
                callback(null,JSON.stringify(data, null, 2));
        });
    }
}







