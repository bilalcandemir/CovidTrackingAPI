var PROTO_PATH = __dirname + "/../main.proto";

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
const { json } = require("express");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

var tracking_proto = grpc.loadPackageDefinition(packageDefinition)
  .covidtracking;

const client = new tracking_proto.covidtracking(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

const doctorProfessions = (req, res) => {
  const payload = { professionId: 1 };
  client.doctorProfessions(payload, function (err, response) {
    console.log(response.professionName);
    res.json(response);
  });
};

const hospital = (req, res) => {
  const payload = { cityId: 1 };
  client.hospital(payload, function (err, response) {
    console.log(response.hospitalName);
    console.log(response.hospitalLatitude);
    console.log(response.hospitalLongitude);
    res.json(response);
  });
};

const city = (req, res) => {
  const payload = { cityId: 1 };
  client.city(payload, function (err, response) {
    console.log(response.cityName);
    console.log(response.cityLatitude);
    console.log(response.cityLongitude);
    res.json(response);
  });
};

const doctorList = (req, res) => {
  const payload = { doctorId: 3 };
  client.doctorList(payload, function (err, response) {
    console.log(response.hospitalName);
    console.log(response.professionName);
    res.json(response);
  });
};

const userLogin = (req, res) => {
  const payload = { identityNo: 31699996800, password: 756500 };
  client.userLogin(payload, function (err, response) {
    if (response.token != "0") {
      console.log("Login is Success here is the Token:");
      console.log(response);
      console.log(response.token);
    } else {
      console.log("Identity Number or Your Password is Wrong");
    }
  });
};

const getUserData = (req, res) => {
  const payload = { userId: 1 };
  client.getUserData(payload, function (err, response) {
    if (response.gender) {
      response.gender = "Erkek";
    } else {
      response.gender = "Kadın";
    }
    console.log(response);
    res.json(response);
  });
};

const calculateBMI = (req, res) => {
  const payload = { userId: 1, weight: 62.4, height: 1.74 };
  client.calculateBMI(payload, function (err, response) {});
};

const signUp = (req, res) => {
  const payload = {
    userId: 4,
    identityNo: 85875,
    name: "",
    surname: "",
    password: "password",
    gender: false,
    age: 21,
    weight: 60.4,
    height: 1.75,
    addressLatitude: 34.345,
    addressLongitude: 25.2342,
    mobileNumber: 123123,
    meritialStatus: false,
    workHealthSector: true,
  };
  client.signUp(payload, function (err, response){
    if (err) {
      console.log(err);
    }
    else {
      console.log("Success");
    }
  })
};
//40.9185  29.3071
const safeArea = (req, res) => {
  const payload = {currentLatitude: 40.9185, currentLongitude: 29.3071, distance: 2000};
  client.safeArea(payload, function(err, response){
    res.json(response);
    console.log(response);
  })
}

const UserDisease = (req, res) => {
  const payload = {
    pneumonia: true,
      covid: true,
      sars: false,
      careUnit: false,
      chronicLung: false,
      diabetes: true,
      hypertension: false,
      chronicLiver: false,
      chronicKidney: false,
      chronicHearth: false,
      geneticDisorder: false,
      bloodCancer: false,
      otherCancer: false,
      takeChemotherapy: false,
      systemDisorder: false,
      takePainkiller: false,
      takeCortisoneDrug: false,
      thalassemia: false,
  };
  client.UserDisease(payload, function (err, response){
    if (err) {
      res.json(err);
    }
    else {
      res.json(response);
    }
  })
};

const covidTest = (req, res) => {
  const payload = {
    userId:1,
      abdominalPain: 1,
      anorexia: 1,
      bluishFace: 2,
      bodyAches: 3,
      chestPain: 1,
      repeatedShaking: 2,
      confusion: 1,
      delirium: 2,
      diarrhea: 3,
      dizziness: 1,
      weakness: 1,
      fever: 37.8,
      feeling: 1,
      headache: 1,
      hoarseVoice: 1,
      lossTasteAndSmell: 2,
      musclePain: 1,
      runnyNose: 1,
      nasalStuffiness: 1,
      nausea: 1,
      ocularReaction: 2,
      persistentCough: 1,
      rhinorrhea: 1,
      shortnessBreath: 1,
      skinRush: 2,
      skippedMeals: 1,
      sneeze: 1,
      soreThroat: 2,
      sputum: 1,
      vomiting: 1,
  };
  client.covidTest(payload, function (err, response){
    if (err) {
      res.json(err);
    }
    else {
      res.json(response);
    }
  })
};

function main() {}
main();

module.exports = {
  doctorProfessions,
  city,
  hospital,
  doctorList,
  userLogin,
  getUserData,
  calculateBMI,
  signUp,
  safeArea,
  UserDisease,
  covidTest
};
