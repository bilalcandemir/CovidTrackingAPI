const KnexPostgis = require("knex-postgis");
const environment = process.env.ENVIRONMENT || "development";
const config = require("../knexfile")[environment];
const knex = require("knex")(config);

const signUp = (req, res) => {
  var id = 0;

  generate(6, function (uniqueId) {
    id = uniqueId;
  });

  knex("myuser")
    .insert({
      userId: id,
      identityNo: parseInt(req.body.identityNo),
      name: req.body.name,
      surname: req.body.surname,
      password: req.body.password,
      gender: req.body.gender,
      age: req.body.age,
      weight: req.body.weight,
      height: req.body.height,
      mobileNumber: parseInt(req.body.mobileNumber),
      meritialStatus: req.body.meritialStatus,
      workHealthSector: req.body.workHealthSector,
    })
    .then(
      res.send({
        message: "Success",
        userId: id,
      })
    );
};

function generate(count, k) {
  var _sym = "1234567890";
  var str = "";

  for (var i = 0; i < count; i++) {
    str += _sym[parseInt(Math.random() * _sym.length)];
  }
  k(str);
}

const addUserAddress = (req, res) => {
  knex
    .update("townId", req.body.townId)
    .from("myuser")
    .where("myuser.userId", parseInt(req.body.userId)).then(
        res.send({message:"Success"})
    )
};

 const userDisease = async (req, res) => {
   
        await knex("userdisease")
          .insert({
            userId: parseInt(req.body.userId),
            ards: req.body.ards,
            pneumonia: req.body.pneumonia,
            covid: req.body.covid,
            sars: req.body.sars,
            careUnit: req.body.careUnit,
            chronicLung: req.body.chronicLung,
            diabetes: req.body.diabetes,
            hypertension: req.body.hypertension,
            chronicLiver: req.body.chronicLiver,
            chronicKidney: req.body.chronicKidney,
            chronicHearth: req.body.chronicHearth,
            geneticDisorder: req.body.geneticDisorder,
            bloodCancer: req.body.bloodCancer,
            otherCancer: req.body.otherCancer,
            takeChemotherapy: req.body.takeChemotherapy,
            systemDisorder: req.body.systemDisorder,
            takePainkiller: req.body.takePainkiller,
            takeCortisoneDrug: req.body.takeCortisoneDrug,
            thalassemia: req.body.thalassemia,
          }).where("userdisease.userId", req.body.userId)
          .then(res.send({message:"Success"}));
      
}

module.exports = { signUp, addUserAddress, userDisease };
