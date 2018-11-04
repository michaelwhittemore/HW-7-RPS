//each player should have an id,
//on load call the most recent child and see
//if it has a second player
var database = firebase.database()
var playerID; //this should either be 1 or 2
var playerThrow = "empty";

window.onload = function () {
    //handler for onload
    database.ref().once("value", function (snapshot) {
        //should reset all values if the database is empty
        if (snapshot.val() == null) { }//reset here
        //check if there's a player waiting 
        if (snapshot.val().waitingForPlayer == 'yes') {
            //set the waiting for player off and let the player
            //know that they have an opponent
            $("#hasOpponent").text("You have a challenger!")
            playerID = 2;
            database.ref().update({
                'waitingForPlayer': "no",
                player1throw: 'empty',
                player2throw: 'empty'
            })
        }
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
}
//updating after a data value is changed


//look for opponent button handler
$("#check").on("click", function (event) {
    event.preventDefault();
    $("#hasOpponent").text("You have no challenger!")
    playerID = 1;
    database.ref().update({
        'waitingForPlayer': "yes"
    })
})
//need a check for when the value of waitingForPlayer changes
database.ref().on("value", function (snapshot) {

})

//the buttons for playing
$("#paper").on("click", function () { gameEvaluator('p') })
$("#rock").on("click", function () { gameEvaluator('r') })
$("#scissors").on("click", function () { gameEvaluator('s') })
//takes in the current player's throw and compares it the
//opponents throw, if the opponent hasn't thrown yet then we
//wait and it will be caught when the player throw is updated
gameEvaluator = function (playerThrow) {
    var throwID='player'+playerID+'throw'
    var throwObject={throwID:playerThrow}
    console.log(throwObject)
    database.ref().update(throwObject)
}


//on load we check how many elements in the players object
//if there's zero or two w e should start a new one and
//add a player to the player object
//if there's one we start the game

//should have a gameplay function when both players are there