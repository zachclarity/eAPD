const timestamp = new Date().toISOString()
  .replace(/[TZ-]/g, '')
  .replace(/:/g, '')
  .split('.')[0]

module.exports = function(plop) {
  plop.setGenerator('migration', {
    description: 'create a knex database migration',
    prompts: [{
      type: 'input',
      name: 'table',
      message: 'table name'
    }],
    actions: [{
      type: 'add',
      path: `migrations/${timestamp}_create-{{table}}.js`,
      templateFile: 'migrations/migration.hbs'
    }]
  });
};
