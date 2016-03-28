/* Author: Kevin Ho
 * Client side operations in generating the visuals as well as functionality
*/

//grab username from path using regex
var username = window.location.pathname.match(/\/user\/(.*)$/)[1];
//open a socket with server
var socket  = io.connect();
//tell server to initialize this client
socket.emit('load', { username : username });


/***************
* Socket Emits *
***************/
// socket for creating review
function createReview(conferenceName, reviewContents){
  socket.emit('createReview', { id : username, name: conferenceName, review: reviewContents });
}
// socket for editting own review
function editReview(conferenceName, reviewContents){
  socket.emit('editReview', { id : username, name: conferenceName, review: reviewContents });
}
// socket for editting account info
function editAccount(accountContents){
  socket.emit('editAccount', { id : username, account: accountContents });
}
// socket for adding conference data
function addConf(confContents){
  socket.emit('addConference', { id : username, conference: confContents });
}
// socket for editting conference data
function editConf(confContents){
  socket.emit('editConference', { id : username, conference: confContents });
}
// get query information from search bar and emit search
function searchConf(searchContents){
  socket.emit('queryConference', { id : username, search: searchContents });
}

/****************
* Socket Reacts *
****************/
//TODO socket for creating review
socket.on('createReviewResult', function(data){

});
//TODO socket for editting own review
socket.on('editReviewResult', function(data){

});
//TODO socket for editting account info
socket.on('editAccountResult', function(data){

});
//TODO socket for adding conference data
socket.on('addConferenceResult', function(data){

});
//TODO socket for editting conference data
socket.on('editConferenceResult', function(data){

});
//socket for searching for conferences
socket.on('queryResult', function(data){
  var result = data.message;
  alert("" + JSON.stringify(result));
});
//initialize
socket.on('initialize', function(data){
  var list = data.conferences;
  alert('' + JSON.stringify(list));
  //convert json to string array
  var conferenceNames = [];
  for (var i = 0; i < list.length; i++) {
    conferenceNames.push(list[i].Name);
    conferenceNames.push(list[i].Acronym);
  }
  //load autofill
  var input = document.getElementById("searchBar");
  var awesomplete = new Awesomplete(input);
  awesomplete.minChars = 1;
  awesomplete.list = conferenceNames;
  alert(conferenceNames);
});
