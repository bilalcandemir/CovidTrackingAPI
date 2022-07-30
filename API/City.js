const KnexPostgis = require("knex-postgis");
const environment = process.env.ENVIRONMENT || "development";
const config = require("../knexfile")[environment];
const knex = require("knex")(config);

const cityList = async (req, res) => {
  var cityListArray = [];
  await knex
    .select("*")
    .from("city")
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        cityListArray.push({
          cityId: data[i].cityId,
          cityName: data[i].cityName,
          cityLatitude: data[i].cityLatitude,
          cityLongitude: data[i].cityLongitude,
        });
      }
    });
    res.send(cityListArray);
};

module.exports = { cityList };
