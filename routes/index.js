var express = require('express');
var router = express.Router();

//These values are fixed here for this assignment, which can be variable or fetched from user
const teamSize = 15;
const salaryCap = 175;

//Generate team players and return roster
router.post('/generateTeam', function(req, res) {

    //Get team name from user and generate player name with that prefix
    var teamName = req.body.teamName;
    //Remove spaces from input team name
    teamName = teamName.replace(/\s/g, '');

    //If team name contains anything other than letters, use default string 'ABCD' as player name prefix
    if(!/^[a-z]+$/i.test(teamName)){
        teamName = 'ABCD';
    }
    generateTotalScores(teamName, function(roster){
        res.send(roster);
    });
});

var generateTotalScores = function(teamName, callBack){
    //3 sets of values possible for "total attribute score" for each player
    const set1Min = 4, set1Max = 15;
    const set2Min = 16, set2Max = 25;
    const set3Min = 26, set3Max = 100;

    //Probability of each set above
    var probability1 = 68, probability2 = 98;

    //Array containing total score values of all players
    var totalScores = [];
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
            while(totalScores.includes(scoreValue)){
                scoreValue = Math.floor((Math.random() * (set1Max - set1Min + 1)) + set1Min);
            }
            totalScores.push(scoreValue);
        }
        else if(value <= probability2){
            scoreValue = Math.floor((Math.random() * (set2Max - set2Min + 1)) + set2Min);
            while(totalScores.includes(scoreValue)){
                scoreValue = Math.floor((Math.random() * (set2Max - set2Min + 1)) + set2Min);
            }
            totalScores.push(scoreValue);
        }
        else{
            scoreValue = Math.floor((Math.random() * (set3Max - set3Min + 1)) + set3Min);
            while(totalScores.includes(scoreValue)){
                scoreValue = Math.floor((Math.random() * (set3Max - set3Min + 1)) + set3Min);
            }
            totalScores.push(scoreValue);
        }

        //Count total attribute sum of all generated players till now
        totalAttributeScore += scoreValue;

        //If the totalAttribute score has reached more than salary cap, generate all values again
        if(totalAttributeScore >= salaryCap){
            i = -1;
            totalAttributeScore = 0;
            count = (Math.ceil(salaryCap / teamSize) * teamSize) - salaryCap;
            totalScores = [];
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
    generatePlayerSkills(teamName, totalScores, callBack);
}

var generatePlayerSkills = function(teamName, totalScores, callBack){
    var roster = [];

    for(var i = 0; i < totalScores.length; i++){
        var player = {};
        //Generate player name in a sequence of alphanumeric values
        player.Name = teamName + '123' + (i+1);

        //Generate player's skill values from total score
        player.totalScore = totalScores[i];
        //First skill point can be from 0 to totalScore point
        player.Speed = Math.floor(Math.random() * (player.totalScore));

        //Second skill point can be from 0 to totalScore - firstSkill point
        player.Strength = Math.floor(Math.random() * ((player.totalScore - player.Speed)));

        //Third skill point will be totalScore - firstSkill - secondSkill point
        player.Agility = player.totalScore - player.Strength - player.Speed;

        roster.push(player)
    }

    callBack(roster);
}

module.exports = router;
