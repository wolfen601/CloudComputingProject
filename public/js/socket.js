/* Author: Kevin Ho
 * Client side operations in generating the visuals as well as functionality
*/

//grab username from path using regex
var username = window.location.pathname.match(/\/user\/(.*)$/)[1];
//open a socket with server
var socket  = io.connect();
 //tell server to initialize this client
 socket.emit('load', { username : username });

 //TODO get query information from search bar and emit search
//  var search = document.getElementById('submitSearch');
//  search.onclick = function(){
//    var searchInput = document.getElementById('searchBar');
//    var searchContents = searchInput.value;
//    socket.emit('queryConference', { id : username, search: searchContents });
//  };
 //TODO account page interaction

 //SOCKETS
 //TODO socket for creating review

 //TODO socket for editting own review

 //TODO socket for editting account info

 //TODO socket for editting conference data

 //socket for searching for conferences
socket.on('queryResult', function(data){
  var result = data.message;
  alert('' + JSON.stringify(result));
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
function searchConf(searchContents){
  socket.emit('queryConference', { id : username, search: searchContents });
}
