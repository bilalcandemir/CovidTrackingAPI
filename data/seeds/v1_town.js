
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('town').del()
    .then(function () {
      // Inserts seed entries
      return knex('town').insert([
        {cityId: 34,townId: 1, townName: 'Pendik'},
        {cityId: 34, townId: 2,townName: 'Tuzla'},
        {cityId: 34, townId: 3,townName: 'Ümraniye'},
        {cityId: 34,townId: 4, townName: 'Eyüp'}
      ]);
    });
};
