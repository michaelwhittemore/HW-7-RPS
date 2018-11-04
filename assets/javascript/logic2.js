



//can we update the childs value? we could play with the last two 
//children? 

// database.ref().child("player1").set("text");
// database.ref().child("player2").set("text");
// database.ref().child('nested').child('nested2').set('text')


$(document).ready(function () {
    var database = firebase.database()
    var playerID;
    var opponentID;
    var wins = 0;
    var losses = 0;
    var ties=0;
    //onload we check if there's a player looking for a game
    //this should only run at the begining of the game
    database.ref().once("value", function (snapshot) {
        //the firebase is empty then we set ourselves as 
        //a new player

        if (snapshot.val() == null) {
            playerID = 'player1';
            opponentID = 'player2';
            database.ref().child('player1').set({
                throw: 'empty',
                //any new keys
            })
        }
        else if (Object.keys(snapshot.val()).length == 1) {
            playerID = 'player2';
            opponentID = 'player1';
            database.ref().child(playerID).set({
                throw: 'empty',
                //any new keys
            })
        }
        // if there's already two players we start a new game
        //by clearing the previous data and assigning us as
        //the first player
        else if (Object.keys(snapshot.val()).length > 1) {
            database.ref().set(null)
            playerID = 'player1'
            opponentID = 'player2';
            database.ref().child(playerID).set({
                throw: 'empty',
                //any new keys
            })
        }
    })
    //buttons for playing
    $("#paper").on("click", function () { throwUpdater('p') })
    $("#rock").on("click", function () { throwUpdater('r') })
    $("#scissors").on("click", function () { throwUpdater('s') })
    //the logic that runs when we press a button
    throwUpdater = function (chosenThrow) {

        database.ref(playerID).child('throw').set(chosenThrow)
        //we check if our oppotent has made their choice
        var opponentThrow;
        database.ref(opponentID).once('value', function (snapshot) {
            opponentThrow = snapshot.val().throw
            console.log("in database ref:" + opponentThrow)
        }).then(function () {
            console.log("out of the ref " + opponentThrow)
            console.log("logic: " + !(opponentThrow == 'empty'))
            if (!(opponentThrow == 'empty')) {
                console.log('here!' + opponentThrow)
                gameEvaluator(chosenThrow, opponentThrow)
            }
        })

    }
    //the game evalutor function takes in our throw and our opptents 
    //and updates our wins and losses
    //and resets our throw
    gameEvaluator = function (myThrow, opponentThrow) {
        console.log('gameeval: ' + myThrow + opponentThrow)
        if ((myThrow == 'r' && opponentThrow == 'p') || (myThrow == 'p' && opponentThrow == 's') || (myThrow == 's' && opponentThrow == 'r')) {
            lose()
        }
        else if ((myThrow == 'p' && opponentThrow == 'r') || (myThrow == 's' && opponentThrow == 'p') || (myThrow == 'r' && opponentThrow == 's')) {
            win()
        }
        else if (myThrow == opponentThrow) {
            tie()
        }
    }
    win = function () {
        wins++;
        $("#wins").text(wins)
        database.ref(playerID).child('throw').set('empty')
    }
    lose = function () {
        losses++;
        $("#losses").text(losses)
        database.ref(playerID).child('throw').set('empty')
    }
    tie = function () {
        ties++;
        $("#ties").text(ties)
        database.ref(playerID).child('throw').set('empty')
    }
})



