
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDHCNRMPpA6LLO088FwaaxZ13R_X3lr_os",
    authDomain: "test-database-b6693.firebaseapp.com",
    databaseURL: "https://test-database-b6693.firebaseio.com",
    projectId: "test-database-b6693",
    storageBucket: "test-database-b6693.appspot.com",
    messagingSenderId: "611066976318"
};
firebase.initializeApp(config);

var database = firebase.database();
var time;
var freq;

$("#addTrain").on("click", function (event) {
    event.preventDefault();

    var trainName = $("#inputTrainName").val().trim();
    var destination = $("#inputDestination").val().trim();
    var trainTime = $("#inputTrainTime").val().trim();
    var trainFreq = $("#inputTrainFreq").val().trim();
    //var id = "train" + trainNum;

    console.log(trainName, destination, trainTime, trainFreq);

    //database.setValue(id);
    database.ref().push({
        trainName: trainName,
        destination: destination,
        trainTime: trainTime,
        trainFreq: trainFreq
    });

    //trainNum++;

    $("#inputTrainName").val("");
    $("#inputDestination").val("");
    $("#inputTrainTime").val("");
    $("#inputTrainFreq").val("");
});

function updateTable() {

    $(".trains").empty();

    database.ref().on("child_added", function (snapshot) {
        time = snapshot.val().trainTime;
        freq = snapshot.val().trainFreq;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var timeConverted = moment(time, "HH:mm").subtract(1, "years");
        console.log(timeConverted);

        // Current Time
        console.log("CURRENT TIME: " + moment().format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(timeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % freq;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = freq - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("LT");

        var newRow = $("<tr>").append(
            $("<td>").text(snapshot.val().trainName),
            $("<td>").text(snapshot.val().destination),
            $("<td>").text(freq),
            $("<td>").text(nextTrain),
            $("<td>").text(tMinutesTillTrain),
        )
        $(".trains").append(newRow);
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
}

setInterval(updateTable, 1000);



