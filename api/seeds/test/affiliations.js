const { roles } = require('./roles');
const { states } = require('../../util/states');

// affiliate 'all-permissions' user with all states
const adminRole = roles.find(role => role.name === 'eAPD Admin');
const adminAffiliations = states.map(state => ({
  user_id: 'all-permissions',
  state_id: state.id,
  role_id: adminRole.id,
  status: 'approved'
}));

exports.seed = async knex => {
  await knex('auth_affiliations').insert(adminAffiliations);
  await knex('auth_affiliations').insert([
    {
      id: 4000,
      user_id: 2010,
      state_id: 'fl',
      status: 'requested'
    },
    {
      id: 4001,
      user_id: 2020,
      state_id: 'md',
      role_id: '1107',
      status: 'approved'
    }
  ]);
};
