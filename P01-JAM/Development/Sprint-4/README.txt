Project: JAM - P01

Team: 
24100175    ABDUL MUIZ
24100277    BISMA NAWAZ
24100127	ABDUR RAFAE HAROON
24100282	WALEED NADEEM
24100308	HAFSA AHMED



------------------------------------------------------------------------------------------------

LIST OF REQUIREMENTS COMPLETED IN THE SPRINT


<List down use cases completed in the current sprint>


Demo link : https://drive.google.com/file/d/1w6WpmLCZsixdrYNSQg5bb2HIZsN4AbbV/view

Contribution to code can be tracked at : sprint4_dev_muiz

Things added:

Quiz format revamped completely				(Muiz)
Database shifted to MongoDb + APIs added		(Muiz)
Quiz are saved to database (if logged in)		(Muiz)
Pagination APIs added for getQuiz and getHistory	(Muiz)
Simulated pages added to '/dummy' route			(Muiz)

API testing 						(Muiz, Waleed, Hafsa)

PAGES REWORKED:

CreateRoom Screen Revamped				(Muiz)
GameSession Screen Revamped				(Muiz)
ChooseQuiz Screen Revamped 				(Muiz)
HostOrPlayer Screen Revamped				(Bisma)
Landing Page Revamped					(Bisma)
CreateQuestion Screen Revamped				(Bisma)
SignIn/Sign Up Screen Revamped				(Bisma)
Waiting Room Screen Revamped				(Waleed)
Viewhistory Screen Revamped (frontend only at '/dummy')	(Hafsa)
GameEnd Screen Revamped 				(Rafae)






------------------------------------------------------------------------------------------------


LIST OF REQUIREMENTS COMPLETED SO FAR

<List down use cases completed so far including those in the previous sprints>

Prototype:

The host should be able to successfully create/get the room ID in order to start the quiz. 
The host should be able to successfully create the quiz. 
The host should be able to set the timer for a specific quiz.
The host should be able to set the maximum number of participants.
A player should be able to join a game lobby using Host ID
A player should be able to see other players and their names while in the lobby
A player should be able to join a game session when the host starts it 
A player should be able to click on an option when given a selection from the server
A player should be able to see the results of the latest quiz they attempted
Any user can choose to be either a Host or a User 
A player should be able to leave a game lobby 

Sprint 1:
Annonymous user implementation (Muiz)
Mid game score reports (Muiz)
Saving and loading past games played (Host and Player) (Muiz)
View History of past games (Bisma, Muiz)
User sign up/ sign in options (Rafae, Waleed, Muiz)
UI validation checks (Settings, View History, Menu checks) (Muiz)
Responsive UI, adjusts to different screen sizes (Bisma)
Better styling on ui (Bisma, Hafsa, Waleed)

Persistance added, Logged on players can rejoin games (Muiz)
Server oriented timeout logic, Server tracks time per question, (previously done on frontend) (Muiz)
Mid session score reports, feature that shows current scores between session (Muiz)
Server disconnection and Leaving room are different now (Muiz)
Server-Client validation checks (Muiz)
User authentication with supabase (Bisma, Rafae, Waleed, Hafsa)

Sprint 2:

Questions with images (Muiz) 
Questions on player Screens option (Muiz)
Exporting Quiz in .CSV format (Bisma)
Importing Quiz from .CSV format (Bisma)
Avatar Pop-up Screen (Hafsa)
Avatar in waiting room + Backend (Muiz)
Avatar leaderboard/score display + Backend (Muiz)


Sprint 3:
Whitelisted developer accounts		(Muiz)
Auto sign in with accounts		(Muiz)
Host can start quizzes early 		(Rafae)
Host can pause the timer 		(Rafae)
Nav Bar implementation 			(Waleed)
Complete overhaul for creating quiz UI	(Bisma)
UI Adjustments				(Bisma, Muiz)
Recording & Saving Response times	(Rafae, Muiz)
Response Time Based Scoring 		(Muiz)

Integrating & Deployment 		(Muiz)
Complete backend file/code refactor	(Muiz)




Sprint 4
Contribution to code can be tracked at : sprint4_dev_muiz

Things added:

Quiz format revamped completely				(Muiz)
Database shifted to MongoDb + APIs added		(Muiz)
Quiz are saved to database (if logged in)		(Muiz)
Pagination APIs added for getQuiz and getHistory	(Muiz)
Simulated pages added to '/dummy' route			(Muiz)

API testing 						(Muiz, Waleed, Hafsa)

PAGES REWORKED:

CreateRoom Screen Revamped				(Muiz)
GameSession Screen Revamped				(Muiz)
ChooseQuiz Screen Revamped 				(Muiz)
HostOrPlayer Screen Revamped				(Bisma)
Landing Page Revamped					(Bisma)
CreateQuestion Screen Revamped				(Bisma)
SignIn/Sign Up Screen Revamped				(Bisma)
Waiting Room Screen Revamped				(Waleed)
Viewhistory Screen Revamped (frontend only at '/dummy')	(Hafsa)
GameEnd Screen Revamped 				(Rafae)





------------------------------------------------------------------------------------------------

HOW TO ACCESS THE SYSTEM


Access web app: https://p1-jam.vercel.app/

Test Locally:

Use the branch: sprint4_dev_muiz (LATEST)

goto main dir, should be P01-JAM OR P01-ProjectNamePending 

Use code . to launch vscode

Use scripts 'initServer' and 'initClient' to init and start both

Use 'startServer' and 'startClient' if dependancies are installed
