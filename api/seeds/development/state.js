exports.seed = async knex => {
  await knex
    .table('states')
    .where({ id: 'ak' })
    .update({
      medicaid_office: JSON.stringify({
        address1: '100 Round Sq',
        city: 'Cityville',
        zip: '12345',
        state: 'Alaska',
        director: {
          name: 'Cornelius Fudge',
          email: 'c.fudge@ministry.magic',
          phone: '5551234567'
        }
      })
    });
};
