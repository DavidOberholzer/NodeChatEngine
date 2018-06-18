const utils = require('../db/utils');
const expect = require('chai').expect;

describe('Database Utils', () => {
    describe('readFile', () => {
        it('should return the json in the file', () => {
            expect(utils.readFile('./test/files/read-test.json'))
                .to.have.property('some')
                .equal("data's");
        });
    });
    describe('escapeRegExp', () => {
        it('should escape all single quotes', () => {
            expect(utils.escapeRegExp("don't be here'")).to.equal("don\'t be here\'");
        });
    });
});
