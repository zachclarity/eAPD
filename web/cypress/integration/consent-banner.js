describe('the federal consent banner', () => {
  beforeEach(() => {
    // Clear the cookies, since that's how we store whether or not the user has
    // accepted the consent banner
    cy.clearCookies();
  });

  it('shows the consent banner then disappears when clicking accept', () => {
    cy.visit('http://localhost:8080');

    // Should be redirected to the /login route
    cy.url().should('include', '/login');

    // Make sure the basic consent message is displayed.
    cy.contains(
      'This is a U.S. government service. Your use indicates your consent to monitoring, recording, and no expectation of privacy. Misuse is subject to criminal and civil penalties.'
    );

    // Click the button for more details.
    cy.contains('Read more details');

    // Click the agree button
    cy.contains('Agree and continue').click();

    cy.contains(
      'This is a U.S. government service. Your use indicates your consent to monitoring, recording, and no expectation of privacy. Misuse is subject to criminal and civil penalties.'
    ).should('not.exist');

    cy.contains('Log in');
  });

  it('shows the consent banner, expands when clicking for more details, then disappears when clicking accept', () => {
    cy.visit('http://localhost:8080');

    // Should be redirected to the /login route
    cy.url().should('include', '/login');

    // Make sure the basic consent message is displayed.
    cy.contains(
      'This is a U.S. government service. Your use indicates your consent to monitoring, recording, and no expectation of privacy. Misuse is subject to criminal and civil penalties.'
    );

    // Click the button for more details.
    cy.contains('Read more details').click();

    // The detail button goes away
    cy.contains('Read more details').should('not.exist');

    // Check for a more detailed message. There's more, but this seems good
    // enough for this test.
    cy.contains(
      'This warning banner provides privacy and security notices consistent with applicable federal laws, directives, and other federal guidance for accessing this Government system, which includes (1) this computer network, (2) all computers connected to this network, and (3) all devices and storage media attached to this network or to a computer on this network.'
    );

    // Click the agree button
    cy.contains('Agree and continue').click();

    cy.contains(
      'This is a U.S. government service. Your use indicates your consent to monitoring, recording, and no expectation of privacy. Misuse is subject to criminal and civil penalties.'
    ).should('not.exist');

    cy.contains('Log in');
  });
});
