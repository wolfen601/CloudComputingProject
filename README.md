# CoCo Conference
A cloud based conference review application that enables participants to review the conferences that they have attended. The application also presents users with graphs that display average ratings for conferences and average ratings for users.

## Requirements
[Node.js installed](https://nodejs.org/en/download/)

[Heroku CLI installed](https://devcenter.heroku.com/articles/heroku-command)

## Setup
### Heroku Setup
1. Clone the repository
2. Move to the directory of the git repo
3. Run "heroku login"
4. Enter username and password
5. Run "heroku create"
6. Run "git push heroku master"
7. Run "heroku ps:scale web=1"
8. Run "heroku open"

### DynamoDB Setup
1. If running locally, update AWS configuration in database.js. Replace "X" with keys.

`var accessKeyId =  process.env.AWS_ACCESS_KEY || "XXXXXXXXXXXX";
var secretAccessKey = process.env.AWS_SECRET_KEY || "XXXXXXXXXXXXX";`

2. Remove the comments surrounding the create tables snippet in database_test.js and run database_test.js.
3. Commment out the create tables snippet and remove the comments surrounding the insert users and insert conferences. Run database_test.js.
4. Run server.js. The application should now load in local host.
