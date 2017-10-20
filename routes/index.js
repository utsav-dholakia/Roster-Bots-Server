var express = require('express');
var router = express.Router();

//These values are fixed here for this assignment, which can be variable or fetched from user
const teamSize = 15;
const salaryCap = 175;

//Generate team players and return roster
router.get('/generateTeam', function(req, res) {

    //Get team name from user and generate player name with that prefix
    var teamName = req.body.teamName;
    //Remove spaces from input team name
    teamName = teamName.replace(/\s/g, '');

    //If team name contains anything other than letters, use default string 'ABCD' as player name prefix
    if(!/^[a-z]+$/i.test(teamName)){
        teamName = 'ABCD';
    }
    var totalScore = generateRoster();


});

function generateRoster(){
    //3 sets of values possible for "total attribute score" for each player
    const set1Min = 4, set1Max = 15;
    const set2Min = 16, set2Max = 25;
    const set3Min = 26, set3Max = 100;

    //Probability of each set above
    var probability1 = 68, probability2 = 98, probability3 = 2;

    //Array containing total score values of all players
    var totalScore = [];
    //count variable keeps track of whether to change the probability of sets above or not
    var count = (Math.ceil(salaryCap / teamSize) * teamSize) - salaryCap;
    var totalAttributeScore = 0;

    for(var i = 0; i < teamSize; i++){
        //Generate a probability value randomly between 1 to 100
        var value = Math.floor((Math.random() * 100) + 1);
        var scoreValue = 0;
        //Generate scoreValue from sets above if the value is between probability limits defined above
        if(value <= probability1){
            scoreValue = Math.floor((Math.random() * (set1Max - set1Min + 1)) + set1Min);
            while(totalScore.includes(scoreValue)){
                scoreValue = Math.floor((Math.random() * (set1Max - set1Min + 1)) + set1Min);
            }
            totalScore.push(scoreValue);
        }
        else if(value <= probability2){
            scoreValue = Math.floor((Math.random() * (set2Max - set2Min + 1)) + set2Min);
            while(totalScore.includes(scoreValue)){
                scoreValue = Math.floor((Math.random() * (set2Max - set2Min + 1)) + set2Min);
            }
            totalScore.push(scoreValue);
        }
        else{
            scoreValue = Math.floor((Math.random() * (set3Max - set3Min + 1)) + set3Min);
            while(totalScore.includes(scoreValue)){
                scoreValue = Math.floor((Math.random() * (set3Max - set3Min + 1)) + set3Min);
            }
            totalScore.push(scoreValue);
        }

        //Count total attribute sum of all generated players till now
        totalAttributeScore += scoreValue;

        //If the totalAttribute score has reached more than salary cap, generate all values again
        if(totalAttributeScore >= salaryCap){
            i = -1;
            totalAttributeScore = 0;
            count = (Math.ceil(salaryCap / teamSize) * teamSize) - salaryCap;
            totalScore = [];
            continue;
        }
        //Change value of count accordingly
        count += scoreValue - Math.ceil(salaryCap / teamSize);

        //If count > 0, then increase probability1 = 90
        if(count > 0){
            probability1 = 90;
        }
        //If count <= 0 then keep probability1 to 68
        else{
            probability1 = 68;
        }
    }
    return totalScore;
}

module.exports = router;
