const KnexPostgis = require("knex-postgis");
const environment = process.env.ENVIRONMENT || "development";
const config = require("../knexfile")[environment];
const knex = require("knex")(config);

const getTestHistory = async (req, res) => {
  var historyArray = [];
  const professionName = await getProfession(req.body.doctorId);
  const hospitalName = await getHospitalName(req.body.doctorId);

  var date = new Date();
  console.log(date);

  await knex("history")
    .join("doctor", "doctor.doctorId", "=", req.body.doctorId)
    .join("myuser", "myuser.userId", "=", req.body.userId)
    .select(
      "doctor.name",
      "history.testDate",
      "history.probablityValue",
      "myuser.identityNo",
      "myuser.age",
      "doctor.surname"
    )
    .where("history.userId", req.body.userId)
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        historyArray.push({
          userId: req.body.userId,
          doctorName: data[i].name,
          doctorSurname: data[i].surname,
          testDate: data[i].testDate,
          probabilityValue: data[i].probablityValue,
          userIdentity: data[i].identityNo,
          userAge: data[i].age,
          doctorProfession: professionName,
          hospitalName: hospitalName
        });
      }
    });
    
  res.send(historyArray);
};


/*
Çevrimiçi test, test bilgisi bulunan kullanıcıların aktif olarak bulunduğu mekandaki güvenliğin sağlanması, Kullanıcının seçtiği doktorlara 
mevcut öksürük sesini, bademciklerinin fotoğrafını ve yüzünün resmini gönderebilmesi.
*/

// async function getProfession(doctorId) {
//     var professionName;
//     await knex("doctor").select("doctor.professionId").where("doctor.doctorId", doctorId).then((data)=>{
//         knex("profession").select("professionName").where("professionId", data[0].professionId).then((data)=>{
//             professionName = data[0].professionName
//             console.log(professionName)
//         })
//     })
//     return professionName;
// }

const getProfession = async (doctorId) => {
  var professionName = "";
  var doctorProfessionId = 0;
  await knex("doctor")
    .select("doctor.professionId")
    .where("doctor.doctorId", doctorId)
    .then((data) => {
      doctorProfessionId = data[0].professionId;
    });

    
   await knex("profession")
        .select("professionName")
        .where("professionId", doctorProfessionId)
        .then((data) => {
          professionName = data[0].professionName;
        });
  return professionName;
};

const getHospitalName = async (doctorId) => {
    var hospitalName = "";
    var doctorHospitalId = 0;
    await knex("doctor")
      .select("doctor.hospitalId")
      .where("doctor.doctorId", doctorId)
      .then((data) => {
        doctorHospitalId = data[0].hospitalId;
      });
  
      
     await knex("hospital")
          .select("hospitalName")
          .where("hospitalId", doctorHospitalId)
          .then((data) => {
            hospitalName = data[0].hospitalName;
          });
    return hospitalName;
  };

module.exports = { getTestHistory };
