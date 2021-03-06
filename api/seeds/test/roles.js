// 10xx IDs refer to activities
// 11xx IDs refer to roles

// For testing, put in our hard-coded stuff so we know what IDs to expect.
const activities = [
  { id: 1001, name: 'view-users' },
  { id: 1002, name: 'view-roles' },
  { id: 1003, name: 'submit-federal-response' },
  { id: 1004, name: 'submit-clearance' },
  { id: 1005, name: 'edit-comments' },
  { id: 1006, name: 'submit-document' },
  { id: 1007, name: 'submit-state-response' },
  { id: 1008, name: 'create-draft' },
  { id: 1009, name: 'edit-document' },
  { id: 1010, name: 'edit-response' },
  { id: 1011, name: 'view-document' },
  { id: 1012, name: 'view-affiliations' },
  { id: 1013, name: 'edit-affiliations' },
  { id: 1014, name: 'approve-state-access' },
];
exports.activities = activities;

const roles = [
  { id: 1101, isActive: true, name: 'eAPD Admin' },
  { id: 1102, isActive: false, name: 'eAPD Federal Analyst' },
  { id: 1103, isActive: false, name: 'eAPD Federal Leadership' },
  { id: 1104, isActive: false, name: 'eAPD Federal SME' },
  { id: 1105, isActive: true, name: 'eAPD State Coordinator' },
  { id: 1106, isActive: false, name: 'eAPD State SME' },
  { id: 1107, isActive: true, name: 'eAPD State Admin' },
];
exports.roles = roles;

// grant 'eAPD Admin' role all activities
const adminRole = roles.find(role => role.name === 'eAPD Admin');
const adminActivities = activities.map(activity => ({
  role_id: adminRole.id,
  activity_id: activity.id
}));

// 'eAPD State Coordinator'
const stateAdminRole = roles.find(role => role.name === 'eAPD State Admin');
const stateAdminActivities = [
  'view-document',
  'submit-document',
  'submit-state-response',
  'create-draft',
  'edit-document',
  'edit-response',
  'approve-state-access'
].map(activityName => ({
  role_id: stateAdminRole.id,
  activity_id: activities.find(activity => activity.name === activityName).id
}));

exports.seed = async knex => {
  await knex('auth_activities').insert(activities);
  await knex('auth_roles').insert(roles);
  await knex('auth_role_activity_mapping').insert(adminActivities);
  await knex('auth_role_activity_mapping').insert(stateAdminActivities);
};
