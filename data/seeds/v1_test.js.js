
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('test').del()
    .then(function () {
      // Inserts seed entries
      return knex('test').insert([
        {userId: 1, suggestionId: 1, probabilityValue: 95.0, lastTestDate: '2020-10-8'},
        {userId: 4, suggestionId: 2, probabilityValue: 26.8, lastTestDate: '2020-06-23'},
        //tarihi 12-30 ayarlayınca patlıyor aq :D
        //büyük ihtimalle 10 günün altında kalan test olunca giriyor fakat userId si farklı bir değer 
        //gösterdiği için olmuyor...
        {userId: 4, suggestionId: 2, probabilityValue: 57.8, lastTestDate: '2020-12-23'}
      ]);
    });
};
