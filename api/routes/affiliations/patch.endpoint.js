const {
  getDB,
  login,
  unauthenticatedTest,
  unauthorizedTest
} = require('../../endpoint-tests/utils');

describe('Affiliations endpoint | PATCH', () => {
  const api = login('all-permissions');
  const db = getDB();
  beforeAll(() => db.seed.run());
  afterAll(() => db.destroy());

  unauthenticatedTest('patch', '/states/fl/affiliations/4000');
  unauthorizedTest('patch', '/states/fl/affiliations/4000');

  ['approved', 'denied', 'revoked'].forEach(status => {
    it(`returns 200, when an affiliation is ${status}`, async () => {
      const response = await api.patch('/states/fl/affiliations/4000', {
        status,
        roleId: 1106
      });
      expect(response.status).toEqual(200);
    });
  })

  it('returns 400 when US state is invalid', async () => {
    const response = await api.patch('/states/zz/affiliations/4000');
    expect(response.status).toEqual(400);
  });

  it('returns 400 when affiliation id is invalid', async () => {
    const response = await api.patch('/states/fl/affiliations/NaN');
    expect(response.status).toEqual(400);
  });

  it('returns 400 when status is invalid', async () => {
    const response = await api.patch('/states/fl/affiliations/4000', {
      status: 'blarg',
      roleId: 1106
    });
    expect(response.status).toEqual(400);
  });
});
