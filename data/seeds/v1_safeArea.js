
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('safearea').del()
    .then(function () {
      // Inserts seed entries

      //pinId kaldırılması lazım burdan kullanıcının pin'i olmicak o pin gönderilecek
      return knex('safearea').insert([
        {userId: 464047, pinId: 1, currentLatitude: 40.9142665, currentLongitude: 29.2961857},
        {userId: 766507, pinId: 2, currentLatitude: 32.4324, currentLongitude: 23.2344}
      ]);
    });
};
