
const express = require('express');

const DoctorList = require('./DoctorList');
const Auth = require('./Auth');
const SignUp = require('./SignUp');
const City = require('./City');
const Town = require('./Town');
const HospitalList = require("./HospitalList");
const SafeArea = require("./SafeArea");
const LastTest = require("./LastTest");
const CovidTest = require("./CovidTest");
const GetTestHistory = require("./GetTestHistory");
const app = express();

app.use(express.json());


app.post('/doctorList', DoctorList.doctorList)
app.post('/login', Auth.authentication)
app.post('/signUp', SignUp.signUp)
app.get('/cityList', City.cityList)
app.post('/townList', Town.townList)
app.post('/updateAddress', SignUp.addUserAddress)
app.post('/userDisease', SignUp.userDisease)
app.post('/hospitalList', HospitalList.hospitalList)
app.post('/safeArea', SafeArea.safeArea)
app.post('/lastTestDate', LastTest.lastTestDate)
app.post('/covidTest', CovidTest.covidTest)
app.post('/getTestHistory', GetTestHistory.getTestHistory)

app.listen(3000);
