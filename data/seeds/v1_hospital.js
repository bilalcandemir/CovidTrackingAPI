
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('hospital').del()
    .then(function () {
      // Inserts seed entries
      return knex('hospital').insert([
        {hospitalId:1 ,hospitalName: "Ümraniye Devlet Hastanesi", cityId: 1, hospitalLatitude: 41.0320085 , hospitalLongitude: 29.1021202},
        {hospitalId:2 ,hospitalName: "Dr. Burhan Nalbantoğlu Devlet Hastanesi", cityId: 2, hospitalLatitude: 35.2051037 , hospitalLongitude: 33.3308184}
      ]);
    });
};
