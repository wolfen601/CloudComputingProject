var aws = require('aws-sdk');
//need to load IAM user with region to work with dynamodb
aws.config.loadFromPath('neil-aws-config.json');
var dynamodb = new aws.DynamoDB();
var docClient = new aws.DynamoDB.DocumentClient();

createTables();

function createTables(){
  //Conference Table
  // note that tables can only have two keys, one hash for ID's and one range for sorting
  // when inserting data, more columns can be added to data than is defined (NoSQL, duh)
  var params = {
    TableName : "Conferences",
    KeySchema: [
        { AttributeName: "ID", KeyType: "HASH" },  //Partition key
        { AttributeName: "Acronym", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "ID", AttributeType: "N" },
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
          console.log(JSON.stringify(err, null, 2));
      else
      //on callback, insert a conference
        insertConference();
        console.log(JSON.stringify(data, null, 2));
  });

  //Users Table
    var params = {
    TableName : "Users",
    KeySchema: [
        { AttributeName: "ID", KeyType: "HASH" },  //Partition key
        { AttributeName: "UserName", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "ID", AttributeType: "N" },
        { AttributeName: "UserName", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
  };

  dynamodb.createTable(params, function(err, data) {
      if (err)
          console.log(JSON.stringify(err, null, 2));
      else
          console.log(JSON.stringify(data, null, 2));
  });


}

function insertConference(){
  var params = {
    TableName: "Conferences",
    Item: {
        "ID":1,
        "Acronym":"ABC",
        "Name":"ABC Conference",
        "Organization": "IEEE",
        "Rating": 3.1
    }
  };

  docClient.put(params, function(err, data) {
      if (err)
          console.log(JSON.stringify(err, null, 2));
      else
      //on callback, make a query to check if conference was inserted properly
        getConference();
          console.log(JSON.stringify(data, null, 2));
  });
}

function getConference(){
  var params = {
    TableName: "Conferences",
    Key: {
        "ID":1,
        "Acronym": "ABC"
    }
};

docClient.get(params, function(err, data) {
    if (err)
        console.log(JSON.stringify(err, null, 2));
    else
    //conference was inserted properly
        console.log(JSON.stringify(data, null, 2));
});
}
