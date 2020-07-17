// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('acceptConsentBanner', () => {
  cy.setCookie('gov.cms.eapd.hasConsented', 'true', { log: false });
});

Cypress.Commands.add('login', () => {
  cy.acceptConsentBanner();
  cy.request({
    method: 'POST',
    url: 'http://localhost:8081/auth/login/nonce',
    body: { username: 'em@il.com' }
  })
    .then(resp =>
      cy.request({
        method: 'POST',
        url: 'http://localhost:8081/auth/login',
        body: { username: 'em@il.com', password: resp.body.data.noce }
      })
    )
    .then(resp => {
      window.localStorage.setItem('token', resp.body.token);
    });
});
