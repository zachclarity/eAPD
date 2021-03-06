const logger = require('../logger')('routes index');
const affiliations = require('./affiliations');
const apds = require('./apds');
const auth = require('./auth');
const me = require('./me');
const states = require('./states')
const users = require('./users');
const openAPI = require('./openAPI');

module.exports = (
  app,
  affiliationsEndpoint = affiliations,
  apdsEndpoint = apds,
  authEndpoint = auth,
  meEndpoint = me,
  statesEndpoint = states,
  usersEndpoint = users,
  openAPIdoc = openAPI
) => {
  logger.silly('setting up routes for affilitions');
  affiliationsEndpoint(app);
  logger.silly('setting up routes for apds');
  apdsEndpoint(app);
  logger.silly('setting up routes for auth');
  authEndpoint(app);
  logger.silly('setting up routes for me');
  meEndpoint(app);
  logger.silly('setting up routes for states');
  statesEndpoint(app);
  logger.silly('setting up routes for users');
  usersEndpoint(app);

  logger.silly('setting up route for OpenAPI');
  app.get('/open-api', (req, res) => {
    logger.verbose({ id: req.id, message: 'sending OpenAPI documentation' });
    res.send(openAPIdoc);
  });
};
