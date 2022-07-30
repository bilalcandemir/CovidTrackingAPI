const KnexPostgis = require("knex-postgis");
const environment = process.env.ENVIRONMENT || "development";
const config = require("../knexfile")[environment];
const knex = require("knex")(config);

const userGenderAge = async (userId) => {
  var userData = [];
  await knex
    .select("gender", "age")
    .from("myuser")
    .where("userId", userId)
    .then((data) => {
      userData = data;
    });
  return userData;
};

const findSuggestion = async () => {
  var suggestion = [];
  await knex
    .select("suggestion", "suggestionId")
    .from("suggestion")
    .then((data) => {
      suggestion = data;
    });
  return suggestion;
};

function generate(count, k) {
  var _sym = "1234567890";
  var str = "";

  for (var i = 0; i < count; i++) {
    str += _sym[parseInt(Math.random() * _sym.length)];
  }
  k(str);
}

const covidTest = async (req, res) => {
  const findUserGenderAge = await userGenderAge(req.body.userId);

  const getSuggestion = await findSuggestion();

  var date = new Date();
  //We need fix this date problem
  console.log(date);
  var probabilityValue;

  var createSymptomId = 0;

  generate(6, function (uniqueId) {
    createSymptomId = uniqueId;
  });

  knex("symptom")
    .insert({
      symptomId: createSymptomId, //Could be a random number.
      abdominalPain: req.body.abdominalPain,
      anorexia: req.body.anorexia,
      bluishFace: req.body.bluishFace,
      bodyAches: req.body.bodyAches,
      chestPain: req.body.chestPain,
      repeatedShaking: req.body.repeatedShaking,
      confusion: req.body.confusion,
      delirium: req.body.delirium,
      diarrhea: req.body.diarrhea,
      dizziness: req.body.dizziness,
      weakness: req.body.weakness,
      fever: req.body.fever,
      feeling: req.body.feeling,
      headache: req.body.headache,
      hoarseVoice: req.body.hoarseVoice,
      lossTasteAndSmell: req.body.lossTasteAndSmell,
      musclePain: req.body.musclePain,
      runnyNose: req.body.runnyNose,
      nasalStuffiness: req.body.nasalStuffiness,
      nausea: req.body.nausea,
      ocularReaction: req.body.ocularReaction,
      persistentCough: req.body.persistentCough,
      rhinorrhea: req.body.rhinorrhea,
      shortnessBreath: req.body.shortnessBreath,
      skinRush: req.body.skinRush,
      skippedMeals: req.body.skippedMeals,
      sneeze: req.body.sneeze,
      soreThroat: req.body.soreThroat,
      sputum: req.body.sputum,
      vomiting: req.body.vomiting,
    })
    .where("symptom.userId", req.body.userId)
    .then(() => {
      var gender;
      var lossSmell;
      var cough;
      var weakness;
      if (findUserGenderAge[0].gender) {
        gender = 1;
      } else {
        gender = 0;
      }

      if (req.body.lossTasteAndSmell != 0) {
        lossSmell = 1;
      } else {
        lossSmell = 0;
      }

      if (req.body.persistentCough == 3) {
        cough = 1;
      } else {
        cough = 0;
      }
      if (req.body.weakness == 3) {
        weakness = 1;
      } else {
        weakness = 0;
      }

      var x =
        -1.32 -
        0.01 * findUserGenderAge[0].age +
        0.44 * gender +
        1.75 * lossSmell +
        0.31 * cough +
        0.49 * weakness;
      var exp = Math.exp(x);
      probabilityValue = 100 * (exp / (1 + exp));
      if (probabilityValue >= 70) {
        addTestTable(
          req.body.userId,
          createSymptomId,
          getSuggestion[1].suggestionId,
          probabilityValue,
          date,
          req.body.doctorId
        );
        res.send({
          result: probabilityValue,
          testDate: date,
          suggestionId: 1,
        });
      } else if (probabilityValue >= 50) {
        addTestTable(
          req.body.userId,
          createSymptomId,
          getSuggestion[0].suggestionId,
          probabilityValue,
          date,
          req.body.doctorId
        );
        res.send({
          result: probabilityValue,
          testDate: date,
          suggestionId: 2,
        });
      }
      else if (probabilityValue >=0 && probabilityValue <= 20) {

      }
    });
};

async function addTestTable(
  userId,
  symptomId,
  suggestionId,
  probabilityValue,
  lastTestDate,
  doctorId
) {
  await knex("test").insert({
    userId: userId,
    symptomId: symptomId,
    suggestionId: suggestionId,
    probabilityValue: probabilityValue,
    lastTestDate: lastTestDate,
  });

  await knex("history").insert({
    userId: userId,
    doctorId: doctorId,
    probablityValue: probabilityValue,
    testDate:lastTestDate
  });
}

module.exports = { covidTest };
