var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var gameStart = false;
var score = 0;
var myTimeOut;
var nama;
var backToName = false;
var myMap = new Map();
var goToLeaderBoard = false;
var sortedMap;

$(".submit").on("click", function(){
    nama = $("#lname").val();
    if(nama == ""){
        alert("Please Fill in Your Name")
    }
    else{
        $("#level-title, #score, #act-score, .lama").css("display", "block");
        $("#player-name, #lname, .submit").css("display", "none");
        $("h1").text("Press A Key to Start");
        gameStart = true;
        backToName = false;
        deleteTable();
    }
})

$(document).on("keydown", function(){
    if(gameStart && goToLeaderBoard){
        backToName = true;
        goToLeaderBoard = false;
        generateTable();
    }
    else if(gameStart && backToName) {
        $("#center").css("display", "none");
        $("#leader").css("display", "none");
        $("#player-name, #lname, .submit").css("display", "inline-block");
        $("#level-title, #score, #act-score, .lama").css("display", "none");
        $("h1").text("Please Input Your Name");  
    }
    else if(gameStart){
        gameStart = false;
        nextSequence();
    }
})

$(".btn").on("click", function(){
    var userChosenColor = this.id;
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);
    gameCheck(level);
});

function nextSequence(){
    var rand = Math.floor((Math.random())*4);
    var randomChosenColor = buttonColours[rand];

    gamePattern.push(randomChosenColor);
    
    var chosenColor = $("#" + randomChosenColor);
    chosenColor.fadeIn(100).fadeOut(100).fadeIn(100);
    
    playSound(randomChosenColor);
    level++;
    userClickedPattern = [];
    $("h1").text("Level " + level);
    $("#act-score").text(score);
    
}

function playSound(color){
    var audio = new Audio("sounds/" + color + ".mp3");
    audio.play();
}

function animatePress(currentColor){
    $("." + currentColor).addClass("pressed");
    
    setTimeout(function(){
        $("." + currentColor).removeClass("pressed");
    }, 100);
}

function gameCheck(level){
    var index = userClickedPattern.length - 1;
    if(userClickedPattern[index] == gamePattern[index])  {
        if(level == userClickedPattern.length){
            score++;
            $("#act-score").text(score);
            myTimeOut = setTimeout(function(){
                nextSequence();
            }, 1000)
        }
    }
    else{
        startOver();
        $("body").addClass("game-over");
        var audio = new Audio("sounds/wrong.mp3");
        audio.play();

        setTimeout(function(){
            $("body").removeClass("game-over");
        }, 200)
    }
}

function startOver(){
    clearTimeout(myTimeOut);
    myMap.set(nama, score);
    sortedMap = new Map([...myMap.entries()].sort((a, b) => b[1] - a[1]));
    // myMap[Symbol.iterator] = function* (){
    //     yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
    // }
    // for (let [key, value] of myMap) {     // get data sorted
    //     console.log(key + ' ' + value);
    //     var newKey = key;
    //     var newValue = value;
    //     console.log(newKey + '' + newValue);
    //     sortedMap.set(newKey, newValue);
    //     console.log(sortedMap);
    // }
    // console.log([...myMap]);
    score = 0;
    nama = "";
    level = 0;
    gamePattern = [];
    userClickedPattern = [];
    $("h1").text("Press Any Key to See the Leaderboard");
    gameStart = true;
    goToLeaderBoard = true;
}

function generateTable(){
    $("#center").css("display", "table");
    $("#leader").css("display", "block");
    $("h1").text("Leaderboard");
    $("#level-title, #score, #act-score, .lama").css("display", "none");
    var table = document.getElementById("center");
    // console.log(table);
    for(i = 0; i < sortedMap.size; i++){
        if(i == 10){
            break;
        }
        else {
            var row = table.insertRow(i+1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var key = Array.from(sortedMap.keys())[i]
            cell1.innerHTML = i+1;
            cell2.innerHTML = key;
            cell3.innerHTML = sortedMap.get(key);
        }
    }
    deletedRow = false;
    // if(i > 10){
    //     table.deleteRow(i-1)
    //     var row = table.insertRow(i-1);
    //     var cell1 = row.insertCell(0);
    //     var cell2 = row.insertCell(1);
    //     var cell3 = row.insertCell(2);
    //     var key = Array.from(sortedMap.keys())[i-1]
    //     cell1.innerHTML = 10;
    //     cell2.innerHTML = key;
    //     cell3.innerHTML = sortedMap.get(key);
    // }
    // else {
    //     var row = table.insertRow(i);
    //     var cell1 = row.insertCell(0);
    //     var cell2 = row.insertCell(1);
    //     var cell3 = row.insertCell(2);
    //     var key = Array.from(sortedMap.keys())[i-1]
    //     console.log(sortedMap);
    //     cell1.innerHTML = i;
    //     cell2.innerHTML = key;
    //     cell3.innerHTML = sortedMap.get(key);
    //     i++
    // }
}

function deleteTable(){
    $("#center").find("tr:gt(0)").remove();
}


