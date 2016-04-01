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
    //alert("" + fullname + " : " + acronym + " : " + lastEditedOn + " : " + description + " : " + organization + " : " + reviews);

    //conference

    //containers
    var containerHead = document.createElement("div");
    containerHead.className = "panel panel-default";
    var headClearfix = document.createElement("div");
    headClearfix.className = "panel-heading clearfix";
    var bodyCollapse = document.createElement("div");
    bodyCollapse.className = "panel-collapse collapse";
    var panelBody = document.createElement("div");
    panelBody.className = "panel-body";

    //CONFERENCE HEADER
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

    headClearfix.appendChild(nameWindow);
    headClearfix.appendChild(acronymWindow);
    headClearfix.appendChild(organizationWindow);
    headClearfix.appendChild(lastEditedOnWindow);
    headClearfix.appendChild(descriptionWindow);

    //CONFERENCE REVIEWS
    //reviews
    var reviewsWindow = document.createElement("div");
    var reviewsText = document.createElement("span");
    reviewsText.innerHTML = "REVIEWS";
    reviewsWindow.appendChild(reviewsText);
    reviewsWindow.id = "reviews";



    //add to body
    panelBody.appendChild(reviewsWindow);
    bodyCollapse.appendChild(panelBody);

    containerHead.appendChild(headClearfix);
    containerHead.appendChild(bodyCollapse);
    conferWindow.appendChild(containerHead);

    //function to loop through years and put reviews in
    showReviews(reviews);
}
function showReviews(reviews){
  var reviewsWindow = document.getElementById('reviews');
  if(reviews != undefined){
    for(var i = 0; i < reviews.length; i++){
      alert(reviews[i]);
      var yearWindow = document.createElement("div");
      yearWindow.innerHTML = "Year: ";
      var yearText = document.createElement("span");
      yearText.className = "reviewSpan";
      yearText.innerHTML = reviews[i].Year || "";
      var yearReviews = document.createElement("div");
      yearWindow.appendChild(yearText);

      var reviewList = reviews[i].Review;
      for(var j = 0; j < reviewList.length; j++){
        var reviewWindow = document.createElement("div");
        //user
        var userWindow = document.createElement("h4");
        userWindow.innerHTML = "User: ";
        var userText = document.createElement("span");
        userText.className = "reviewSpan";
        userText.innerHTML = reviewList[j].User || "";
        userWindow.appendChild(userText);
        //created on
        var createdOnWindow = document.createElement("h4");
        createdOnWindow.innerHTML = "Created On: ";
        var createdOnText = document.createElement("span");
        createdOnText.className = "reviewSpan";
        createdOnText.innerHTML = reviewList[j].CreatedOn || "";
        createdOnWindow.appendChild(createdOnText);
        //rating
        var ratingWindow = document.createElement("h4");
        ratingWindow.innerHTML = "Rating: ";
        var ratingText = document.createElement("span");
        ratingText.className = "reviewSpan";
        ratingText.innerHTML = reviewList[j].Rating || "";
        ratingWindow.appendChild(ratingText);
        //details
        var detailsWindow = document.createElement("h4");
        detailsWindow.innerHTML = "Details: ";
        var detailsText = document.createElement("span");
        detailsText.className = "reviewSpan";
        detailsText.innerHTML = reviewList[j].Details || "";
        detailsWindow.appendChild(detailsText);
        //review
        reviewWindow.appendChild(userWindow);
        reviewWindow.appendChild(createdOnWindow);
        reviewWindow.appendChild(ratingWindow);
        reviewWindow.appendChild(detailsWindow);
        //add to the year
        yearReviews.appendChild(reviewWindow);
      }
      //append reviews for each year
      yearWindow.appendChild(yearReviews);
      reviewsWindow.appendChild(yearWindow);
    }
  }
}
