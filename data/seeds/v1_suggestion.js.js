
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('suggestion').del()
    .then(function () {
      // Inserts seed entries
      return knex('suggestion').insert([
        {suggestionId: 1, suggestion: 'Be Safe Your result is not a bid deal :)'},
        {suggestionId: 2, suggestion: 'You are on risk. You need to go to the hospital.'},
      ]);
    });
};
