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
  getuserMesela();
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

//Olay budur ikinci bir for açmamız gerekecek
async function getuserMesela(){
  var users = [1,4];
  var testArray = [];
  for (let i = 0; i < users.length; i++) {
    await knex.select('userId', 'probabilityValue','lastTestDate').from('test').where('userId', users[i]).then((data)=>{
      for (let y = 0; y < data.length; y++) {
        testArray.push(data[y].probabilityValue)
      }
    })
  }
  console.log(testArray);
  
}



function getPin(call, callback) {}
/*
Kullanıcının safeArea bölmesine girdiğinde yakınında olan insanların son test zamanlarına ve bu testin sonucuna göre
bir pinColor ve status gönderen SQL Query
*/
async function safeArea(call, callback) {
  var testCount;
  //this function need userId
  await knex
    .count("userId as CNT")
    .from("test")
    .then((counterData) => {
      testCount = counterData[0].CNT;
      console.log(testCount);
      return testCount;
    });

   await knex
    .select("userId", "currentLatitude", "currentLongitude")
    .from("safearea")
    .then((data) => {
      var counter = 0;
      var users = [];

      for (let i = 0; i < data.length; i++) {
        //Calculate distance metres with Users CurrentLatitude and CurrentLongitude
        var R = 6371e3; // metres
        var φ1 = (call.request.currentLatitude * Math.PI) / 180; // φ, λ in radians lat1
        var φ2 = (data[i].currentLatitude * Math.PI) / 180; //lat2
        var Δφ =
          ((data[i].currentLatitude - call.request.currentLatitude) * Math.PI) /
          180; //(lat2-lat1)
        var Δλ =
          ((data[i].currentLongitude - call.request.currentLongitude) *
            Math.PI) /
          180; //(lon2-lon1)
        var a =
          Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // in metres

        //To access test results for users in the distance



        //Learn How many people in distance
        if (call.request.distance >= d) {
          //Just add users in the area
          users.push(data[i].userId);
          counter++;
        }
        console.log(users);
      }

      if (counter == 0){
        callback(null, {
          status: "You are in safe",
          pinColor: "#FFFFFF",
          peopleCount: counter,
        });
      }
      //usersın içindeki id ye göre bütün test sonuçlarını bir arrayde tutup onun sayısına göre döndürürsem olur.

      if (testCount != 0) {
        //Check last test date for callback the pins.
        //Bütün insanların testlerine bakıyorum mal gibi bütün insanların değil sadece çevrede olan insanlarınki gerekiyor.
        for (let y = 0; y < testCount; y++) {
          knex
            .select("userId", "lastTestDate")
            .from("test")
            .then((testData) => {
              var time = new Date();
              var differentTime = Math.abs(time - testData[y].lastTestDate);
              var differentDays = Math.ceil(
                differentTime / (1000 * 60 * 60 * 24)
              );
              console.log(testData);

              //If users distance has people who has Covid-19 test 10 day ago
              //
              if (differentDays <= 10) {
                knex
                  .select("probabilityValue")
                  .from("test")
                  .where("userId", testData[y].userId)
                  .then((probabilityData) => {
                    console.log(probabilityData);
                    //Has test and his test Result, callback pins
                    if (probabilityData[0].probabilityValue >= 90) {
                      knex
                        .select("pinColor", "status")
                        .from("pin")
                        .where("pinId", 1)
                        .then((pinData) => {
                          callback(null, {
                            status: pinData[0].status,
                            pinColor: pinData[0].pinColor,
                            peopleCount: counter,
                          });
                        });
                    } else if (probabilityData[0].probabilityValue >= 70) {
                      knex
                        .select("pinColor", "status")
                        .from("pin")
                        .where("pinId", 2)
                        .then((pinData) => {
                          callback(null, {
                            status: pinData[0].status,
                            pinColor: pinData[0].pinColor,
                            peopleCount: counter,
                          });
                        });
                    } else if (probabilityData[0].probabilityValue >= 50) {
                      knex
                        .select("pinColor", "status")
                        .from("pin")
                        .where("pinId", 3)
                        .then((pinData) => {
                          callback(null, {
                            status: pinData[0].status,
                            pinColor: pinData[0].pinColor,
                            peopleCount: counter,
                          });
                        });
                    }
                    else {
                      knex
                        .select("pinColor", "status")
                        .from("pin")
                        .where("pinId", 2)
                        .then((pinData) => {
                          callback(null, {
                            status: pinData[0].status,
                            pinColor: pinData[0].pinColor,
                            peopleCount: counter,
                          });
                        });
                    }
                  });
                  //Bundada test sonuçlarına bakmalıyız. Sadece eskiden pozitif olanlara baksak yeter
              } else if (differentDays <= 20) {
                knex
                  .select("pinColor", "status")
                  .from("pin")
                  .where("pinId", 4)
                  .then((pinData) => {
                    callback(null, {
                      status: pinData[0].status,
                      pinColor: pinData[0].pinColor,
                      peopleCount: counter,
                    });
                  });
              } else {
                knex
                  .select("pinColor", "status")
                  .from("pin")
                  .where("pinId", 5)
                  .then((pinData) => {
                    callback(null, {
                      status: pinData[0].status,
                      pinColor: pinData[0].pinColor,
                      peopleCount: counter,
                    });
                  });
              }
            });
        }
      } else {
        callback(null, {
          status: "You are in safe",
          pinColor: "#FFFFFF",
          peopleCount: counter,
        });
      }
    });
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
