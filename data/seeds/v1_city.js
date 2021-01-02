
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('city').del()
    .then(function () {
      // Inserts seed entries
      return knex('city').insert([
        {cityId: 1, cityName: 'İstanbul', cityLatitude: 41.0054958, cityLongitude: 28.8720961},
        {cityId: 2, cityName: 'Lefkoşa', cityLatitude: 35.1923177, cityLongitude: 33.3623828},
        {cityId: 3, cityName: 'Gazimağusa', cityLatitude: 35.1194761, cityLongitude: 33.8989479}
      ]);
    });
};
