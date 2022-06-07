# **WORDLE WORLD PARTY**

| Developers: |
| ----------- |
| Tristan Lilford | 
| Van Niekerk Ferreira | 
| Robin Jonker | 
| Johann Gouws | 
| Tristan Basel | 

## **Description:**

Wordle World Party is a multiplayer version of the popular Wordle game. Our game also has a solo mode where you can play an unlimited amount of games a day.

In the multiplayer mode, its a 1v1 game against an opponent on the internet, and you compete to see who can get the correct word in as little guesses as possible. An exciting feature is the ability to be involved in the multiplayer game as an 'ADMIN'. The 'ADMIN' decides what word the 2 players need to guess and can view the match occurring in real time! All multiplayer games need at least 2 'PLAYERS' to start, regardless if there is an' ADMIN' or not. An 'ADMIN' can only view games once the 2 'PLAYERS' have subsequently started their match.

We have added features to our game that include a detailed Game Log for both individual and multiplayer games so that you can retrospectively study the game as it occured, your specific word guesses, and the final correct word that you were aiming to get.

We also have the much anticipated ranking system where you need to compete to climb the ranks. The ranking table is based on your win percentage of your multiplayer games.

## **Known Bugs:**

- If you are using the same browser to run many intances of the web page, only the latest login will have the correct session data, as session cookies are stored on the browsers and new instances will overwrite the session cookie data. To avoid this, use different browsers. 
- Once you have entered the queue page and you are waiting for an opponent in the mutliplyaer screen, if you decide to leave the screen it does not remove you from the queue, however, the next player that joins will add you to their game which will remove you from the queue. 
- If testing the game on the live website, and you want to mimick being 2 or 3 accounts, from the same IP address, then the socket communication between the Chrome browser and a different browser does not occur. We suggest using Opera GX, Microsoft Edge, and Firefox as browsers to mimick the multiplayer game with 3 different users. The game works fully across different IP addresses.
- Testing with puppeteer is not fully enabled on the main branch. There is a branch called dev_puppeteerTesting where the testing is done via a dummy web app to showcase the UI tests.

## **Future Features:**

- Adding a scoring system for the 'ADMIN' where depending on how difficult they make the word, their score increases or decreases, can be an exciting feature
- The ability to change your password if you have forgotten your accounts password, at present you need to create a new account.

## **Game Link:**

Click the following link to access our game that has been deployed live using Azure for our deployment. Create an account and get going!

### https://wordleworldparty.azurewebsites.net/

- Note: The game was deployed using a student account and there is a possibility that the student credit would have been used up if the link does not work.

## **Development:**

Node.js is used for a web server in conjunction with the Express framework. Socket.io is used for the multiplayer communication.
For the front-end, Bootstrap component library is used. Three.js was used for the landing page. Microsoft’s
Azure platform is used for deployment. A persistent data store was setup using Microsoft’s SQL Server Management Studio (SSMS). Continous testing was done using Jest and Puppyteer which was automated on GitHub Actions.

## **Summary:**

The development of this web based multiplayer game occurred over 4 weeks. Each week within the production was defined as a Sprint in order to complete the 4 Sprint production cycle. A comprehensive folder full of all the documents relating to each Sprint along with documents such as our Architectural Decision Records and Project Conventions is presented. Please find the Game Images below that are screenshots of the different pages and situations within the game.

## **Game Images:**

Screenshots of the whole game and its different pages and game situations have been added and can be found within the public/assets/images folder.

### Download the repo to see the whole app working locally or simply just join us online for the best competitive Wordle experience you can find!