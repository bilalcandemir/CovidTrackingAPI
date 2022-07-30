
const KnexPostgis = require("knex-postgis");
const environment = process.env.ENVIRONMENT || "development";
const config = require("../knexfile")[environment];
const knex = require("knex")(config);

const authentication = async (req,res) => {
  var result = "";
    await knex
    .select("identityNo", "password")
    .from("myuser")
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        if (
        
          data[i].identityNo == parseInt(req.body.identityNo) &&
          data[i].password == parseInt(req.body.password)
        ) {
          result = "Success"
        } else {
          result = "Failure"
        }
      }
      res.send({message:result})
      
    });
}

module.exports = {authentication}