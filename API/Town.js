const KnexPostgis = require("knex-postgis");
const environment = process.env.ENVIRONMENT || "development";
const config = require("../knexfile")[environment];
const knex = require("knex")(config);

const townList = async (req, res) => {
  var townListArray = [];
  await knex
    .select("*")
    .from("town")
    .where("town.cityId", req.body.cityId)
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        townListArray.push({
          cityId: data[i].cityId,
          townId: data[i].townId,
          townName: data[i].townName
        });
      }
    });
  res.send(townListArray);
};



module.exports = { townList };
