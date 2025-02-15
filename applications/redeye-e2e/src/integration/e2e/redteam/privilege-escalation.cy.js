/// <reference types="cypress" />

describe('Privilege Escalation Tag', () => {
	const camp = 'PETagOnly';
	const fileName = 'gt.redeye';
	const cmd = 'keylogger';
	const comment = 'Privilege Escalation comment';
	const partialTag = 'Privilege';

	it('Privilege Escalation icon should appear when PE tag is used on a comment; Presentation Mode reflects the count of PE tags', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign and log current number of Privilege Escalation tags
		cy.selectCampaign(camp);
		cy.clickPresentationMode();
		cy
			.get('[cy-test=PrivilegeEscalation] [cy-test=count]')
			.invoke('text')
			.as('PETagCount')
			.then((resultPECount1) => {
				// Go to Commands, select command, verify Privilege Escalation icon is not there
				cy.clickExplorerMode();

				cy.clickCommandTypesTab();

				cy.selectCommandType(cmd);

				cy.get('[cy-test=PrivilegeEscalation]').should('not.exist');

				// Add a comment and use the existing Privilege Escalation tag
				cy.addComment(0, comment);

				cy.addExistingTags(partialTag);

				// Verify the Privilege Escalation icon is now there
				cy.get('[cy-test=PrivilegeEscalation]').should('be.visible');

				// Log new number of Privilege Escalation comments and compare to original count
				cy.clickPresentationMode();

				cy.get('@PETagCount').then((resultPECount2) => {
					expect(+resultPECount2).to.equal(+resultPECount1 + +'1');

					cy.get('[cy-test=PrivilegeEscalation]').should('have.length', 1);
				});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
