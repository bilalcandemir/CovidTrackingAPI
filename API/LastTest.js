const KnexPostgis = require("knex-postgis");
const environment = process.env.ENVIRONMENT || "development";
const config = require("../knexfile")[environment];
const knex = require("knex")(config);

const lastTestDate = async (req,res) => {
    var array = [];
    await knex("test").select("lastTestDate","probabilityValue").where("userId", req.body.userId).then((data)=>{
        var time = new Date();
        for (let i = 0; i < data.length; i++) {
          array.push(data[i].lastTestDate);
        }
    })
    array.sort(function(a, b) {
        return a - b;
      });

  res.send({"lastTestDate":array[0]});
}

module.exports = {lastTestDate};