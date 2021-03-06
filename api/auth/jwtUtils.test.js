/* eslint-disable global-require, no-shadow */
const tap = require('tap');
const sinon = require('sinon');

const sandbox = sinon.createSandbox();
const mockVerifier = sandbox.stub();

tap.test('jwtUtils', async t => {
  t.afterEach(async () => {
    sandbox.resetBehavior();
    sandbox.resetHistory();
  });

  t.test('verifyWebToken()', async t => {
    const { verifyWebToken } = require('./jwtUtils');

    t.test('given a valid JWT', async t => {
      const claims = { email: 'test@email.com' };
      mockVerifier.resolves(claims);
      const result = await verifyWebToken('good token', {
        verifier: mockVerifier
      });
      t.equal(result, claims, 'returns a valid claim');
    });

    t.test('given an invalid JWT string', async t => {
      mockVerifier.rejects({ message: 'bad token' });
      const result = await verifyWebToken('bad token', {
        verifier: mockVerifier
      });
      t.equal(result, false, 'returns false');
    });
  });

  t.test('jwtExtractor()', async t => {
    const { jwtExtractor } = require('./jwtUtils');
    let request;

    t.beforeEach(async () => {
      request = new Map();
    });

    const scenarios = [
      ['Bearer xxx.yyy.zzz', 'xxx.yyy.zzz', 'returns the JWT'],
      ['bearer xxx.yyy.zzz', 'xxx.yyy.zzz', 'returns the JWT'],
      ['bearer', null, 'returns null'],
      ['', null, 'returns null'],
      ['Elephanter xxx.yyy.zzz', null, 'returns null']
    ];

    scenarios.forEach(([header, expected, message]) => {
      t.test(`given Authorization header is '${header}'`, async t => {
        request.set('Authorization', header);
        const result = jwtExtractor(request);
        t.equal(result, expected, message);
      });
    });
  });
});
