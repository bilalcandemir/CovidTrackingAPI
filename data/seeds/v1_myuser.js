exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("myuser")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("myuser").insert([
        {
          userId: 1,
          identityNo: 31699996800,
          name: "Ahmet Bilal",
          surname: "Candemir",
          password: "756500",
          gender: true,
          age: 21,
          weight: 62.4,
          height: 1.74,
          bmi: 3.24,
          mobileNumber: 5432986291,
          meritialStatus: false,
          workHealthSector: false,
          selectedDoctorId: 2,
        },
      ]);
    });
};
