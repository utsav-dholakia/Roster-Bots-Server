# Roster-Bots

This is a server side application for creating roster of bots with generic attributes.
It creates a server utilizing Node.js that provides REST service to generate roster of players. The only data needed in the request is team name that will be prefixed to the bot names. (This is optional)

The server creates list of players randomly with total attribute score that is unique in the lineup. Maximum possible value for total score is 100. This score is calculated based on 3 skill points (Speed + Strength + Agility). Maximum possible aggregate score for team is 175 (Can also be called as a salary cap for the owner).

The server first creates random numbers from sets of values between (4-18) with probability 68, (19-25) with probability 30 and (26-100) with probability 2. Then, whichever set is picked, a random number is generated from that set while checking if that score already exists in the lineup or not, and then a count value which keeps track of what is the aggregate score till now from the ideal average value possible is updated. If count is (+ve), first set's probability is increased to 90 to generate players with less score till count becomes negative, then first set's probability is reset to 68.

Then for all the players, separate skill point values (Speed, Strength, Agility) are generated based on total skill value along with a name for that bot. All this is sent back to client in a JSON object.

### __ASSUMPTIONS__
* Each bot generated has a unique name which is Alphanumeric.
* If the client sends anything other than letters (even empty string), default prefix for bot names is 'ABCD12'.
* No two bots has same total attribute score (Speed + Strength + Agility).
* The bot list is sorted in descending order and then starting from highest value, first 10 players are put in starting lineup and last 5 are put in substitute lineup.


### __STEPS TO RUN__
* Install Node.js and npm(preferrably node version : 8.6.0 and npm version : 3.10.10).
* Clone this repository.
* Run __npm update__ command at the root of the project. This will download and update all the dependacies needed to run/test this server.
* To run the server, use __npm start__ command at the root of project directory.
* To test the server, use __npm test__ command at the root of project directory. You have to keep the server running for performing tests.


## __Note__
* The probability values, set limits, team size and salary cap (175 points) can be changed to create bots with other random values.
* This project is built using Node version : 8.6.0 and npm version : 3.10.10.
* This project is built using Webstorm IDE from JetBrains.
