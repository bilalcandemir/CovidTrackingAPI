
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('profession').del()
    .then(function () {
      // Inserts seed entries
      return knex('profession').insert([
        {professionId: 1, professionName: 'Internal Diseases'},
        {professionId: 2, professionName: 'Otolaryngology'},
        {professionId: 3, professionName: 'Chest Diseases'}
      ]);
    });
};
