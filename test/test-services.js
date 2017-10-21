const chai  = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('/POST get roster of bots', function(){
    it('it should get json object of roster', function(done) {
        chai.request('http://localhost:5555')
        .post('/generateTeam')
        .send({teamName : 'XYZ'})
        .end(function (err, res) {
            if(err) {
                console.error(err);
            }
            should.exist(res);
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('totalTeamScore');
            res.body.should.have.property('starters');
            res.body.should.have.property('substitutes');
            done();
        });
    });
});


describe('/POST get roster of bots and check values for correctness', function(){
    it('it should get json object of roster and check values inside', function(done){
        chai.request('http://localhost:5555')
            .post('/generateTeam')
            .send({teamName : 'XYZ'})
            .end(function (err, res) {
                if(err) {
                    console.error(err);
                }
                should.exist(res);
                res.should.have.status(200);
                res.should.be.json;
                if(res.body.totalTeamScore > 175){
                    var error = new Error('Total team score exceeds 175');
                    throw error;
                }
                else{
                    var totalScore = 0;
                    var scoreList = [];
                    var nameList = [];
                    var starters = res.body.starters;
                    var substitutes = res.body.substitutes;
                    var scoreError = new Error('There is a duplicate score value');
                    var nameError = new Error('There is a duplicate name value');
                    var valueExceed = new Error('There is a score value that exceeds 100 points');

                    for(var i = 0; i < 15; i++){
                        if(i < 10){
                            if(starters[i].totalScore > 100){
                                throw valueExceed;
                            }
                            else{
                                totalScore += starters[i].totalScore;
                                if(scoreList.includes(starters[i].totalScore)){
                                    throw scoreError;
                                }
                                scoreList.push(starters[i].totalScore);
                                if(nameList.includes(starters[i].Name)){
                                    throw nameError;
                                }
                                nameList.push(starters[i].Name);
                            }
                        }
                        else{
                            if(substitutes[i - 10].totalScore > 100){
                                throw valueExceed;
                            }
                            else{
                                totalScore += substitutes[i - 10].totalScore;
                                if(scoreList.includes(substitutes[i - 10].totalScore)){
                                    throw scoreError;
                                }
                                scoreList.push(substitutes[i - 10].totalScore);
                                if(nameList.includes(substitutes[i - 10].Name)){
                                    throw nameError;
                                }
                                nameList.push(substitutes[i - 10].Name);
                            }
                        }
                    }
                }
                done();
            });
    })
});