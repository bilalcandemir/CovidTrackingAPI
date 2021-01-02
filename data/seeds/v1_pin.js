
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('pin').del()
    .then(function () {
      // Inserts seed entries
      return knex('pin').insert([
        {pinId: 1, pinColor: '#000000', pinName: 'Danger', status: 'Too many people.'},
        {pinId: 2, pinColor: '#800000', pinName: 'Safe Area', status: 'Your area is safe.'},
        {pinId: 3, pinColor: '#FFFFFF', pinName: 'Normal', status: 'Some people in your area but not close.'},
        {pinId: 4, pinColor: '#103FF2', pinName: 'Last test is 20 days ago', status: 'There are people around you who havent been tested in a long time'},
        {pinId: 5, pinColor: '#103FF3', pinName: 'No Test', status: 'There are people around you who havent been Covid-19 Test'}
      ]);
    });
};
