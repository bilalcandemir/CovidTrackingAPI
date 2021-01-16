var PROTO_PATH = __dirname + "/../main.proto";

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
const KnexPostgis = require("knex-postgis");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const environment = process.env.ENVIRONMENT || "development";
const config = require("../knexfile")[environment];
const knex = require("knex")(config);

const st = KnexPostgis(knex);

var tracking_proto = grpc.loadPackageDefinition(packageDefinition)
  .covidtracking;

function doctorProfessions(call, callback) {
  var id = call.request.professionId;
  knex
    .select("professionName")
    .from("profession")
    .where({ professionId: parseInt(id) })
    .then((data) => {
      console.log(data);
      callback(null, {
        professionName: JSON.stringify(data[0].professionName),
      });
    });
}

function city(call, callback) {
  knex
    .select("*")
    .from("city")
    .where({ cityId: parseInt(call.request.cityId) })
    .then((data) => {
      callback(null, {
        cityName: JSON.stringify(data[0].cityName),
        cityLatitude: JSON.stringify(data[0].cityLatitude),
        cityLongitude: JSON.stringify(data[0].cityLongitude),
      });
    });
}

function hospital(call, callback) {
  knex
    .select("*")
    .from("hospital")
    .where({ cityId: parseInt(call.request.cityId) })
    .then((data) => {
      callback(null, {
        hospitalName: JSON.stringify(data[0].hospitalName),
        hospitalLatitude: JSON.stringify(data[0].hospitalLatitude),
        hospitalLongitude: JSON.stringify(data[0].hospitalLongitude),
      });
    });
}

function doctorList(call, callback) {
  knex("doctor")
    .join("hospital", "doctor.hospitalId", "=", "hospital.hospitalId")
    .join("profession", "doctor.professionId", "=", "profession.professionId")
    .select(
      "doctor.name",
      "doctor.surname",
      "hospital.hospitalName",
      "profession.professionName"
    )
    .where("doctor.doctorId", call.request.doctorId)
    .then((data) => {
      callback(null, {
        doctorName: JSON.stringify(data[0].name),
        doctorSurname: JSON.stringify(data[0].surname),
        hospitalName: JSON.stringify(data[0].hospitalName),
        professionName: JSON.stringify(data[0].professionName),
      });
    });
}

function userLogin(call, callback) {
  knex
    .select("identityNo", "password")
    .from("myuser")
    .then((data) => {
      if (
        data[0].identityNo == parseInt(call.request.identityNo) &&
        data[0].password == parseInt(call.request.password)
      ) {
        callback(null, { token: 123456 });
      } else {
        callback(null, { token: 0 });
      }
    });
}

//Problem: Sadece 1 tane doktor ekleyebilecek şu anki durumda
function getUserData(call, callback) {
  knex("myuser")
    .join("doctor", "myuser.selectedDoctorId", "=", "doctor.doctorId")
    .select(
      "myuser.name",
      "myuser.surname",
      "gender",
      "age",
      "weight",
      "height",
      "bmi",
      "addressLatitude",
      "addressLongitude",
      "mobileNumber",
      "doctor.name as doctorName",
      "doctor.surname as doctorSurname"
    )
    .where("myuser.userId", call.request.userId)
    .then((data) => {
      callback(null, {
        name: JSON.stringify(data[0].name),
        selectedDoctorName: JSON.stringify(
          data[0].doctorName + " " + data[0].doctorSurname
        ),
        surname: JSON.stringify(data[0].surname),
        gender: data[0].gender,
        age: data[0].age,
        weight: data[0].weight,
        height: data[0].height,
        bmi: data[0].bmi,
        addressLatitude: data[0].addressLatitude,
        addressLongitude: data[0].addressLongitude,
        mobileNumber: data[0].mobileNumber,
      });
    });
}

function calculateBMI(call) {
  var weight = call.request.weight;
  var height = call.request.height;
  height = height * height;
  var bmi = weight / height;
  knex("myuser")
    .insert({ bmi: bmi })
    .where("myuser.userId", call.request.userId);
  console.log(weight);
  console.log(height);
  console.log(bmi);
}

function signUp(call, callback) {
  knex("myuser")
    .insert({
      userId: call.request.userId,
      identityNo: call.request.identityNo,
      name: call.request.name,
      surname: call.request.surname,
      password: call.request.password,
      gender: call.request.gender,
      age: call.request.age,
      weight: call.request.weight,
      height: call.request.height,
      addressLatitude: call.request.addressLatitude,
      addressLongitude: call.request.addressLongitude,
      mobileNumber: call.request.mobileNumber,
      meritialStatus: call.request.meritialStatus,
      workHealthSector: call.request.workHealthSector,
    })
    .then(callback(null));
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
        console.log(data);
        for (let y = 0; y < data.length; y++) {

          var time = new Date();
          var differentTime = Math.abs(time - data[y].lastTestDate);
          var differentDays = Math.ceil(differentTime / (1000 * 60 * 60 * 24));

          if (differentDays <= 10) {
            console.log(data[y].probabilityValue);
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

async function safeArea(call, callback) {

  const findDistanceUserArray = await findDistance(
    call.request.distance,
    call.request.currentLatitude,
    call.request.currentLongitude
  );
  console.log(findDistanceUserArray);

  const findLastTestArray = await distanceUsers(findDistanceUserArray);
  console.log(findLastTestArray);
  findLastTestArray.sort(function(a, b) {
    return a - b;
  });
  if (findLastTestArray.length != 0){
    if (findLastTestArray[0] == 1){
      callback(null, {status: "There are some peoples in your area who has Covid-19 test result is Positive", pinColor:"#FF0000", peopleCount:findDistanceUserArray.length})
    }
    else if (findLastTestArray[0] == 2){
      callback(null, {status: "You are int the Safe Zone.", pinColor:"#00FF00", peopleCount:findDistanceUserArray.length})
    }
    else if (findLastTestArray[0] == 3){
      callback(null, {status: "There are people in your area but the test results are negative", pinColor:"#FFFFFF", peopleCount:findDistanceUserArray.length})
    }
    else if (findLastTestArray[0] == 4){
      callback(null, {status: "There are people around you who havent been tested in a long time", pinColor:"#103FF2", peopleCount:findDistanceUserArray.length})
    }
    else if (findLastTestArray[0] == 5){
      callback(null, {status: "There are people around you who havent been Covid-19 Test", pinColor:"#000000", peopleCount:findDistanceUserArray.length})
    }
  }
}

function main() {
  var server = new grpc.Server();
  server.addService(tracking_proto.covidtracking.service, {
    doctorProfessions,
    city,
    hospital,
    doctorList,
    userLogin,
    getUserData,
    calculateBMI,
    signUp,
    safeArea,
  });
  server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
  server.start();
}
main();
