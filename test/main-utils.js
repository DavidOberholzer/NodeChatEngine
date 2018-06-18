const utils = require('../utils');
const expect = require('chai').expect;

describe('Main Utils Module', () => {
    let message = {
        text: 'This should not be different'
    };
    const inputs = {
        var1: 'Jeremy',
        var2: 'Dokes'
    };
    describe('loadVariables', () => {
        it('should export a function', () => {
            expect(utils.loadVariables).to.be.a('function');
        });
        it('should not change a message without a variable', () => {
            utils.loadVariables(message, inputs);
            expect(message.text).to.equal('This should not be different');
        });
        it('should replace varaibles in a message', () => {
            message = {
                text: 'This should be different {{var1}} {{ var2 }}!'
            };
            utils.loadVariables(message, inputs);
            expect(message.text).to.equal('This should be different Jeremy Dokes!');
        });
    });
});
