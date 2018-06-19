describe('Chat UI Test', function() {
    beforeEach(() => {
        cy.visit('/');
    });
    it('Visits the chat site', function() {
        cy.get('input[id=username-input]').type('admin');
        cy.get('input[id=password-input]').type('admin');
        cy.get('button[data-cy=login').click();
        cy.url().should('include', '/chat-space');
    });
    it('Check out a workflow', function() {
        cy.get('input[id=username-input]').type('admin');
        cy.get('input[id=password-input]').type('admin');
        cy.get('button[data-cy=login').click();
        cy.url().should('include', '/chat-space');
        cy.get('div[data-cy=chooseworkflow]').click();
        cy.get('li[data-cy=0]').click();
        cy.get('button[data-cy=back]').click();
        cy.get('div[data-cy=chooseworkflow]');
    });
});
