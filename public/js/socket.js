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
  socket.emit('queryConference', { id : username, name: searchContents });
}

/****************
* Socket Reacts *
****************/
//TODO socket for creating review
socket.on('createReviewResult', function(data){
  var result = data.message;
  alert("" + JSON.stringify(result));
});
//TODO socket for editting own review
socket.on('editReviewResult', function(data){
  var result = data.message;
  alert("" + JSON.stringify(result));
});
//TODO socket for editting account info
socket.on('editAccountResult', function(data){
  var result = data.message;
  alert("" + JSON.stringify(result));
});
//TODO socket for adding conference data
socket.on('addConferenceResult', function(data){
  var result = data.message;
  alert("" + JSON.stringify(result));
});
//TODO socket for editting conference data
socket.on('editConferenceResult', function(data){
      var result = data.message;
  alert("" + JSON.stringify(result));
});
//socket for searching for conferences
socket.on('queryResult', function(data){
  var result = data.message;
  alert("" + JSON.stringify(result));
  showConferences(data);
});


//initialize
socket.on('initialize', function(data){
  var list = data.conferences;
  //alert('' + JSON.stringify(list));
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
  //alert(conferenceNames);
});
function showConferences(data){

    var conferWindow = document.getElementById('home');
    conferWindow.innerHTML = "";
    //data
    var fullname = data.message.FullName;
    var acronym = data.message.Acronym;
    var lastEditedOn = data.message.LastEditedOn;
    var description = data.message.Description;
    var organization = data.message.Organization;
    var reviews = data.message.Reviews;
    alert("" + fullname + " : " + acronym + " : " + lastEditedOn + " : " + description + " : " + organization + " : " + reviews);
    //conference
    //fullname
    var nameWindow = document.createElement("h4");
    nameWindow.innerHTML = "Conference Name: ";
    var nameText = document.createElement("span");
    nameText.className = "conferenceSpan";
    nameText.innerHTML = fullname || "";
    nameWindow.appendChild(nameText);
    //acronym
    var acronymWindow = document.createElement("h4");
    acronymWindow.innerHTML = "Acronym: ";
    var acronymText = document.createElement("span");
    acronymText.className = "conferenceSpan";
    acronymText.innerHTML = acronym || "";
    acronymWindow.appendChild(acronymText);
    //organization
    var organizationWindow = document.createElement("h4");
    organizationWindow.innerHTML = "Organization: ";
    var organizationText = document.createElement("span");
    organizationText.className = "conferenceSpan";
    organizationText.innerHTML = organization || "";
    organizationWindow.appendChild(organizationText);
    //lastEditedOn
    var lastEditedOnWindow = document.createElement("h4");
    lastEditedOnWindow.innerHTML = "Last Edited On: ";
    var lastEditedOnText = document.createElement("span");
    lastEditedOnText.className = "conferenceSpan";
    lastEditedOnText.innerHTML = lastEditedOn || "";
    lastEditedOnWindow.appendChild(lastEditedOnText);
    //description
    var descriptionWindow = document.createElement("h4");
    descriptionWindow.innerHTML = "Description: ";
    var descriptionText = document.createElement("span");
    descriptionText.className = "conferenceSpan";
    descriptionText.innerHTML = description || "";
    descriptionWindow.appendChild(descriptionText);
    //reviews
    var reviewWindow = document.createElement("div");
    //TODO function to loop through years and put reviews in
    
    //add to window
    conferWindow.appendChild(nameWindow);
    conferWindow.appendChild(acronymWindow);
    conferWindow.appendChild(organizationWindow);
    conferWindow.appendChild(lastEditedOnWindow);
    conferWindow.appendChild(descriptionWindow);

}
