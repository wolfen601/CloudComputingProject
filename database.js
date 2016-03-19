var aws = require('aws-sdk');
var dynamodb = new aws.DynamoDB();


function createTables(){
  //Conference Table
  // note that tables can only have two keys, one hash for ID's and one range for sorting
  // when inserting data, more columns can be added to data than is defined
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
  //I don't know where the dynamodb gets this object
  docClient.put(params, function(err, data) {
      if (err)
          console.log(JSON.stringify(err, null, 2));
      else
          console.log(JSON.stringify(data, null, 2));
  });
}
