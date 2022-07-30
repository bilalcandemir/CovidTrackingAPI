
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('hospital').del()
    .then(function () {
      // Inserts seed entries
      return knex('hospital').insert([
        {hospitalId:1 ,hospitalName: "Ümraniye Devlet Hastanesi", townId: 2},
        {hospitalId:2 ,hospitalName: "Tuzla Devlet Hastanesi", townId: 2},
        {hospitalId:3 ,hospitalName: "Pendik Devlet Hastanesi", townId: 2},
        {hospitalId:4 ,hospitalName: "Pendik Devlet Hastanesi", townId: 3},
        {hospitalId:5 ,hospitalName: "Pendik Devlet Hastanesi", townId: 3}
      ]);
    });
};
