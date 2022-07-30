exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("doctor")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("doctor").insert([
        {
          doctorId: 1,
          identityNo: 31699996800,
          name: "Ahmet Bilal",
          surname: "CANDEMİR",
          image: "doctorBilal.jpg",
          hospitalId: 1,
          professionId: 1,
        },
        {
          doctorId: 2,
          identityNo: 12345678910,
          name: "Sevban",
          surname: "KURUCAN",
          image: "doctorSevban.jpg",
          hospitalId: 2,
          professionId: 2,
        },
        {
          doctorId: 3,
          identityNo: 10987654321,
          name: "Mesut",
          surname: "DUKAN",
          image: "doctorMesut.jpg",
          hospitalId: 1,
          professionId: 1,
        },
        {
          doctorId: 4,
          identityNo: 10987654321,
          name: "Mesut",
          surname: "DUKAN",
          image: "doctorMesut.jpg",
          hospitalId: 4,
          professionId: 1,
        },
        {
          doctorId: 5,
          identityNo: 10987654321,
          name: "Mesut",
          surname: "DUKAN",
          image: "doctorMesut.jpg",
          hospitalId: 5,
          professionId: 1,
        },
      ]);
    });
};
