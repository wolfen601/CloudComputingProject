/* Author: Kevin Ho
 * Client side operations in generating the visuals as well as functionality
*/
document.addEventListener("DOMContentLoaded", function() {
  //grab username from path using regex
   var username = window.location.pathname.match(/\/user\/(.*)$/)[1];
   //open a socket with server
   var socket  = io.connect();
   //tell server to initialize this client
   socket.emit('load', { username : username });
   //load autofill
   var input = document.getElementById("searchBar");
   var awesomplete = new Awesomplete(input);

   //example of private communication
   socket.emit('queryConference', { id : username });


   //logout
   var logout = document.getElementById('logout');
   var loggingOut = false;
   logout.href = "/logout/" + username;
   logout.onclick = function(){
     loggingOut = true;
     var taskList = getTaskListFromTable();
     socket.emit('logout', { id : username , tasks : taskList});
   };

   //SOCKETS


  socket.on('queryResult', function(data){
    var result = data.message;
    alert('' + result);
  });

});
