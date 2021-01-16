
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('pin').del()
    .then(function () {
      // Inserts seed entries
      return knex('pin').insert([
        {pinId: 1, pinColor: '#FF0000', pinName: 'Positive Result', status: 'There are some peoples in your area who has Covid-19 test result is Positive'},
        {pinId: 2, pinColor: '#00FF00', pinName: 'Safe Area', status: 'You are int the Safe Zone.'},
        {pinId: 3, pinColor: '#FFFFFF', pinName: 'Normal', status: 'Some people in your area but they Test result is Negative.'},
        {pinId: 4, pinColor: '#103FF2', pinName: 'Last test is 20 days ago', status: 'There are people around you who havent been tested in a long time'},
        {pinId: 5, pinColor: '#000000', pinName: 'No Test', status: 'There are people around you who havent been Covid-19 Test'}
      ]);
    });
};
