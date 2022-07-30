const KnexPostgis = require("knex-postgis");
const environment = process.env.ENVIRONMENT || "development";
const config = require("../knexfile")[environment];
const knex = require("knex")(config);

const checkUserFunction = async(userId,latitude, longitude) => {
  var safeAreaTable = 0;
  await knex("safearea").select("userId").where("userId", userId).then((data)=>{
    safeAreaTable = data.length
  })

  console.log(safeAreaTable);

  if (safeAreaTable <= 0) {
    await knex("safearea").insert({userId:userId, currentLatitude:latitude, currentLongitude:longitude});
  }
  else {
    await knex("safearea").update({"currentLatitude":latitude, "currentLongitude":longitude}).where("userId", userId)
  }
}

const findDistance = async (distance, latitude, longitude) => {
    var users = [];
    await knex
      .select("userId", "currentLatitude", "currentLongitude")
      .from("safearea")
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          //Calculate distance metres with Users CurrentLatitude and CurrentLongitude
          var R = 6371e3; // metres
          var φ1 = (latitude * Math.PI) / 180; // φ, λ in radians lat1
          var φ2 = (data[i].currentLatitude * Math.PI) / 180; //lat2
          var Δφ = ((data[i].currentLatitude - latitude) * Math.PI) / 180; //(lat2-lat1)
          var Δλ = ((data[i].currentLongitude - longitude) * Math.PI) / 180; //(lon2-lon1)
          var a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          var d = R * c; // in metres
          //Learn How many people in distance
          if (distance >= d) {
            //Just add users in the area
            users.push(data[i].userId);
          }
        }
      });
    return users;
  };
  
  
  const distanceUsers = async (users) => {
    var testArray = [];
    for (let i = 0; i < users.length; i++) {
      await knex
        .select("userId", "probabilityValue", "lastTestDate")
        .from("test")
        .where("userId", users[i])
        .then((data) => {
          for (let y = 0; y < data.length; y++) {
  
            var time = new Date();
            var differentTime = Math.abs(time - data[y].lastTestDate);
            var differentDays = Math.ceil(differentTime / (1000 * 60 * 60 * 24));
  
            if (differentDays <= 10) {
              if (data[y].probabilityValue >= 75) {
                testArray.push(1);
              }
               else if (data[y].probabilityValue >= 60) {
                testArray.push(3);
              }
               else {
                testArray.push(3);
              }
            }
            else if (differentDays <= 20){
              testArray.push(5);
            }
          }
        });
    }
    return testArray;
  };

  
  
  async function safeArea(req,res) {
    const findDistanceUserArray = await findDistance(
      req.body.distance,
      req.body.currentLatitude,
      req.body.currentLongitude
    );

    const addSafeArea = await checkUserFunction(req.body.userId, req.body.currentLatitude, req.body.currentLongitude)

    const findLastTestArray = await distanceUsers(findDistanceUserArray);
    findLastTestArray.sort(function(a, b) {
      return a - b;
    });
    if (findLastTestArray.length != 0){
      if (findLastTestArray[0] == 1){
          res.send({status: "There are some peoples in your area who has Covid-19 test result is Positive", pinColor:"#FF0000", peopleCount:findDistanceUserArray.length})
      }
      else if (findLastTestArray[0] == 2){
        res.send({status: "You are in the Safe Zone.", pinColor:"#00FF00", peopleCount:findDistanceUserArray.length})
      }
      else if (findLastTestArray[0] == 3){
        res.send({status: "There are people in your area but the test results are negative", pinColor:"#FFFFFF", peopleCount:findDistanceUserArray.length})
      }
      else if (findLastTestArray[0] == 4){
        res.send({status: "There are people around you who havent been tested in a long time", pinColor:"#103FF2", peopleCount:findDistanceUserArray.length})
      }
      else if (findLastTestArray[0] == 5){
        res.send({status: "There are people around you who havent been Covid-19 Test", pinColor:"#000000", peopleCount:findDistanceUserArray.length})
      }
    }

    else {
        res.send({status: "You are on Safe Area", pinColor:"#000000", peopleCount:0})
    }
  }

  module.exports = {safeArea};