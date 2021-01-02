exports.up = function (knex) {
  return knex.schema
    .createTable("city", (table) => {
      table.increments("cityId");
      table.string("cityName").notNullable();
      table.float("cityLatitude", 14, 10);
      table.float("cityLongitude", 14, 10);
    })
    .createTable("hospital", (table) => {
      table.increments("hospitalId");
      table.string("hospitalName").notNullable();
      table.float("hospitalLatitude", 14, 10);
      table.float("hospitalLongitude", 14, 10);
      table.integer("cityId").unsigned();
      table
        .foreign("cityId")
        .references("city.cityId")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("profession", (table) => {
      table.increments("professionId");
      table.string("professionName");
    })
    .createTable("doctor", (table) => {
      table.increments("doctorId");
      table.bigInteger("identityNo").unsigned();
      table.string("name");
      table.string("surname");
      table.string("image");
      table.integer("hospitalId").unsigned();
      table.integer("professionId").unsigned();
      table
        .foreign("hospitalId")
        .references("hospital.hospitalId")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .foreign("professionId")
        .references("profession.professionId")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("myuser", (table) => {
      table.increments("userId");
      table.bigInteger("identityNo");
      table.string("name");
      table.string("surname");
      table.string("password");
      table.boolean("gender");
      table.integer("age");
      table.float("weight");
      table.float("height");
      table.float("bmi");
      table.float("addressLatitude", 14, 10);
      table.float("addressLongitude", 14, 10);
      table.bigInteger("mobileNumber");
      table.boolean("meritialStatus");
      table.boolean("workHealthSector");
      table.integer("selectedDoctorId").unsigned();
      table
        .foreign("selectedDoctorId")
        .references("doctor.doctorId")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("userdisease", (table) => {
      table.integer("userId").unsigned();
      table.boolean("ards");
      table.boolean("pneumonia");
      table.boolean("covid");
      table.boolean("sars");
      table.boolean("careUnit");
      table.boolean("chronicLung");
      table.boolean("diabetes");
      table.boolean("hypertension");
      table.boolean("chronicLiver");
      table.boolean("chronicKidney");
      table.boolean("chronicHearth");
      table.boolean("geneticDisorder");
      table.boolean("bloodCancer");
      table.boolean("otherCancer");
      table.boolean("takeChemotherapy");
      table.boolean("systemDisorder");
      table.boolean("takePainkiller");
      table.boolean("takeCortisoneDrug");
      table.boolean("thalassemia");
      table
        .foreign("userId")
        .references("myuser.userId")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("symptom", (table) => {
      table.increments("symptomId");
      table.integer("abdominalPain");
      table.integer("anorexia");
      table.integer("bluishFace");
      table.integer("bodyAches");
      table.integer("chestPain");
      table.integer("repeatedShaking");
      table.integer("confusion");
      table.integer("delirium");
      table.integer("diarrhea");
      table.integer("dizziness");
      table.integer("weakness");
      table.float("fever");
      table.integer("feeling");
      table.integer("headache");
      table.integer("hoarseVoice");
      table.integer("lossTasteAndSmell");
      table.integer("musclePain");
      table.integer("runnyNose");
      table.integer("nasalStuffiness");
      table.integer("nausea");
      table.integer("ocularReaction");
      table.integer("persistentCough");
      table.integer("rhinorrhea");
      table.integer("shortnessBreath");
      table.integer("skinRush");
      table.integer("skippedMeals");
      table.integer("sneeze");
      table.integer("soreThroat");
      table.integer("sputum");
      table.integer("vomiting");
      table.integer("userId").unsigned();
      table
        .foreign("userId")
        .references("myuser.userId")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("pin", (table) => {
      table.increments("pinId");
      table.string("pinColor");
      table.string("pinName");
      table.string("status");
    })
    .createTable("safearea", (table) => {
      table.integer("userId").unsigned();
      table.integer("pinId").unsigned();
      table.float("currentLatitude", 14, 10);
      table.float("currentLongitude", 14, 10);
      table
        .foreign("userId")
        .references("myuser.userId")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .foreign("pinId")
        .references("pin.pinId")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("suggestion", (table) => {
      table.increments("suggestionId");
      table.text("suggestion", "longtext");
    })
    .createTable("test", (table) => {
      table.integer("userId").unsigned();
      table.integer("symptomId").unsigned();
      table.integer("suggestionId").unsigned();
      table.float('probabilityValue');
      table.date("lastTestDate")
      table
        .foreign("userId")
        .references("myuser.userId")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .foreign("symptomId")
        .references("symptom.symptomId")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .foreign("suggestionId")
        .references("suggestion.suggestionId")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("history", (table) => {
      table.integer("userId").unsigned();
      table.integer("doctorId").unsigned();
      table.date("testDate");
      table.integer("probablityValue");
      table
        .foreign("userId")
        .references("myuser.userId")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .foreign("doctorId")
        .references("doctor.doctorId")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("record", (table) => {
      table.increments("recordId");
      table.integer("userId").unsigned();
      table.integer("symptomId").unsigned();
      table.binary("tonsilImage");
      table.binary("faceVideo");
      table.binary("voice");
      table
        .foreign("userId")
        .references("myuser.userId")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .foreign("symptomId")
        .references("symptom.symptomId")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    }).createTable('denemeStorage', (table) => {
      table.integer('id');
      table.string('name');
      table.string('image');
    })
};

exports.down = function (knex) {
  return knex.schema
  .dropTableIfExists("denemeStorage")
    .dropTableIfExists("record")
    .dropTableIfExists("history")
    .dropTableIfExists("test")
    .dropTableIfExists("suggestion")
    .dropTableIfExists("safearea")
    .dropTableIfExists("pin")
    .dropTableIfExists("symptom")
    .dropTableIfExists("userdisease")
    .dropTableIfExists("myuser")
    .dropTableIfExists("doctor")
    .dropTableIfExists("profession")
    .dropTableIfExists("hospital")
    .dropTableIfExists("city");
};
