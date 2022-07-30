const KnexPostgis = require("knex-postgis");
const environment = process.env.ENVIRONMENT || "development";
const config = require("../knexfile")[environment];
const knex = require("knex")(config);

const hospitalList = async (req, res) => {
  var listArray = [];

  await knex("hospital")
    .select("hospital.hospitalName", "hospital.hospitalId")
    .where("hospital.townId", req.body.townId)
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        listArray.push({
          hospitalName: data[i].hospitalName,
          hospitalId: data[i].hospitalId,
        });
      }
    });

  var endList = [];
  for (let j = 0; j < listArray.length; j++) {
    var level = await doctorList(listArray[j].hospitalId);

    endList.push({townName: "Ümraniye", hospitalName: listArray[j].hospitalName, doctors: level });
  }

  res.send(endList);
};

async function doctorList(hospitalId) {
  var array = [];

  await knex("doctor")
    .select("doctor.name", "doctor.surname")
    .where("doctor.hospitalId", hospitalId)
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        array.push({ name: data[i].name, surname: data[i].surname });
      }
    });
  return array;
}

module.exports = { hospitalList };
