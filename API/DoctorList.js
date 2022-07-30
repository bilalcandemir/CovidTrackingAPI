
const KnexPostgis = require("knex-postgis");
const environment = process.env.ENVIRONMENT || "development";
const config = require("../knexfile")[environment];
const knex = require("knex")(config);

const doctorList = (req, res) => {

    knex("doctor")
    .join("hospital", "doctor.hospitalId", "=", "hospital.hospitalId")
    .join("profession", "doctor.professionId", "=", "profession.professionId")
    .select(
      "doctor.name",
      "doctor.surname",
      "hospital.hospitalName",
      "profession.professionName"
    )
    .where("doctor.doctorId", req.body.doctorId)
    .then((data) => {
        res.send({
            doctorName:data[0].name,
            doctorSurname:data[0].surname,
            hospitalName:data[0].hospitalName,
            professionName:data[0].professionName
        })
    });
  }

  module.exports = {doctorList};