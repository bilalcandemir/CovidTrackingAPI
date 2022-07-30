
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('test').del()
    .then(function () {
      // Inserts seed entries
      return knex('test').insert([
        {userId: 495837, suggestionId: 1, probabilityValue: 95.0, lastTestDate: '2021-05-10'},
        {userId: 495837, suggestionId: 2, probabilityValue: 26.8, lastTestDate: '2021-05-23'},
        //tarihi 12-30 ayarlayınca patlıyor aq :D
        //büyük ihtimalle 10 günün altında kalan test olunca giriyor fakat userId si farklı bir değer 
        //gösterdiği için olmuyor...
        {userId: 29234, suggestionId: 2, probabilityValue: 97.8, lastTestDate: '2021-04-12'}
      ]);
    });
};
