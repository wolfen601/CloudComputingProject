/* Author: Kevin Ho
 * Client side operations in generating the visuals as well as functionality
*/
document.addEventListener("DOMContentLoaded", function() {
  //grab username from path using regex
   var username = window.location.pathname.match(/\/user\/(.*)$/)[1];
   var date = new Date();
   //TODO account page interaction

   //TODO creating review

   //TODO editting review

   //TODO editting account info

   //TODO adding conference data
    var add = document.getElementById('submitReview');
    add.onclick = function(){
      var acronymName = document.getElementById('acronymName').innerHTML;
      var ratingInput = document.getElementById('submitRating').value;
      var details = document.getElementById('details').value;
      var reviewContents = {
        "Reviews":[
            {
                "Year": date.getFullYear(),
                "Review": [
                    {
                        "User": username,
                        "CreatedOn": date.getDate()  + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear(),
                        "Rating": ratingInput,
                        "Details": details
                    }
                ]
            }
        ]
      };
      alert("" + JSON.stringify(reviewContents));
      createReview(acronymName, reviewContents);
    };

   //TODO editting conference data

   //search
   var search = document.getElementById('submitSearch');
   search.onclick = function(){
     var searchInput = document.getElementById('searchBar');
     var searchContents = searchInput.value;
     searchConf(searchContents);
   };

   //TODO other interactions


   //logout
   var logout = document.getElementById('logout');
   logout.href = "/logout/" + username;

});
