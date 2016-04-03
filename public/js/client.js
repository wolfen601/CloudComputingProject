/* Author: Kevin Ho
 * Client side operations in generating the visuals as well as functionality
*/
document.addEventListener("DOMContentLoaded", function() {
    //grab username from path using regex
    var username = window.location.pathname.match(/\/user\/(.*)$/)[1];
    var date = new Date();
    //TODO account page interaction

    //creating review
    var addReview = document.getElementById('submitReview');
    addReview.onclick = function(){
      var acronymName = document.getElementById('acronymName').innerHTML;
      var ratingInput = document.getElementById('submitRating').value;
      var details = document.getElementById('details').value;
      var reviewContents = {
        "Year": date.getFullYear(),
        "Review":[
         {
             "User": username,
             "CreatedOn": date.getDate()  + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear(),
             "Rating": ratingInput,
             "Details": details
         }
        ]
     };
     //alert("" + JSON.stringify(reviewContents));
     createReview(acronymName, reviewContents);
    };
    //TODO editting account info
    var submitEditAccount = document.getElementById('submitEditAccount');
    submitEditAccount.onclick = function(){
       var passwordDisplay = document.getElementById('passwordDisplay').innerHTML;
       var passwordInput = document.getElementById('password').value || passwordDisplay ;
       var accountContents = {
         "User": username,
         "Password": passwordInput,
         "LastLoggedIn": date.getDate()  + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear()
       };
       //alert("" + JSON.stringify(confContents));
       editAccount(accountContents);
    };

    //TODO adding conference data


    //editting conference data
    var editConfButton = document.getElementById('submitEditConf');
    editConfButton.onclick = function(){
      var acronymName = document.getElementById('acronymName').innerHTML;
      var organizationName = document.getElementById('organizationName').innerHTML;
      var descriptionName = document.getElementById('descriptionName').innerHTML;
      var organizationInput = document.getElementById('organization').value || organizationName ;
      var descriptionInput = document.getElementById('description').value || descriptionName;
      var confContents = {
        "Description": descriptionInput,
        "Organization": organizationInput,
        "LastEditedOn": date.getDate()  + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear()
      };
      //alert("" + JSON.stringify(confContents));
      editConf(acronymName, confContents);
    };

    //search
    var search = document.getElementById('submitSearch');
    search.onclick = function(){
      var searchInput = document.getElementById('searchBar');
      var searchContents = searchInput.value;
      if(searchContents == ""){
        alert("No search entered.");
      }else{
        searchConf(searchContents);
      }
    };

    //TODO other interactions


    //logout
    var logoutElement = document.getElementById('logout');
    logoutElement.href = "/logout/" + username;
    logoutElement.onclick = function(){
      var usernameDisplay = document.getElementById("usernameDisplay").innerHTML;
      var passwordDisplay = document.getElementById("passwordDisplay").innerHTML;
      var userContents = {
        "User": usernameDisplay,
        "Password": passwordDisplay,
        "LastLoggedIn": date.getDate()  + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear()
      };
      logout(userContents);
    }
});
