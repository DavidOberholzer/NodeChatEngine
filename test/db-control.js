const DBController = require('../db/control');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const assert = chai.assert;
const expect = chai.expect;

describe('Database Controller', () => {
    const db = DBController.getDB();
    describe('getDB', () => {
        it('should get a new instance of the DB client', () => {
            expect(db).to.be.a('object');
        });
    });
    describe('setup', () => {
        it('should create all the tables', () => {
            DBController.setup();
        });
    });
    describe('loadData', () => {
        it('should load test data', function(done) {
            this.timeout(500);
            setTimeout(done, 50);
            DBController.loadData('./test/files/test-data.json');
        });
    });
    describe('connect', () => {
        it('should get the first state of the workflow and load the message buffer', function(done) {
            this.timeout(500);
            setTimeout(done, 50);
            DBController.connect(1);
        });
    });
    describe('messageBuffer', () => {
        it('should retrieve the messages in the buffer', function(done) {
            this.timeout(500);
            setTimeout(done, 50);
            const messages = DBController.getMessageBuffer();
            expect(messages.length).to.gte(1);
            expect(messages[0].text).to.not.equal('Message not valid without goto!');
        });
    });
    describe('sendMessageCorrect', () => {
        it('should send a message and then load the new message in the buffer', function(done) {
			this.timeout(500);
            setTimeout(done, 50);
            DBController.sendMessage({ goto: 2 });
        });
    });
    describe('messageBufferCorrectSend', () => {
        it('should have the next message in the buffer', function(done) {
            this.timeout(500);
            setTimeout(done, 50);
            const messages = DBController.getMessageBuffer();
            expect(messages.length).to.gte(1);
            expect(messages[0].text).to.not.equal('Message not valid without goto!');
        });
    });
    describe('sendMessageIncorrect', () => {
        it('should send a bad message and then load the correct response in the buffer', function(done) {
			this.timeout(500);
            setTimeout(done, 50);
            DBController.sendMessage({});
        });
    });
    describe('messageBufferIncorrectSend', () => {
        it('should have the correct error message in the buffer', function(done) {
            this.timeout(500);
            setTimeout(done, 50);
            const messages = DBController.getMessageBuffer();
            expect(messages.length).to.gte(1);
            expect(messages[0].text).to.equal('Message not valid without goto!');
        });
    });
    after(() => {
        db.end();
    });
});
