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

Things added:

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




------------------------------------------------------------------------------------------------

HOW TO ACCESS THE SYSTEM


Access web app: https://p01-jam.vercel.app/

Test Locally:

Use the branch: sprint2_dev_muiz (LATEST)

goto main dir, should be P01-ProjectNamePending 
open two terminals
terminal 1: cd P01-namePending\\Development\\Sprint-1\\backend & npm i
terminal 2: cd P01-namePending\\Development\\Sprint-1\\JAM && npm i

terminal 1: npm run start
terminal 2: npm run dev

OR given you have node modules installed:  

Use two seperate terminals to run npm run startServer and npm run startClient in main dir
