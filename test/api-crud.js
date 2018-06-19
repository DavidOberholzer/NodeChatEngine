const expect = require('chai').expect;
const request = require('request');

describe('API Crud Calls', () => {
    let token = 'testtoken';
    describe('authenticate', () => {
        it('should return a valid token on successful login', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'admin',
                    password: 'admin'
                })
            };
            request.post('http://localhost:3000/authenticate', options, (error, response, body) => {
                const token = JSON.parse(body).token;
                expect(token).to.be.a('string');
            });
        });
    });
    describe('member', () => {
        it('should get all members', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            };
            request.get('http://localhost:3000/api/v1/member', options, (error, response, body) => {
                expect(JSON.parse(body).length).to.be.equal(2);
            });
        });
        it('should get one member', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            };
            request.get(
                'http://localhost:3000/api/v1/member/2',
                options,
                (error, response, body) => {
                    expect(JSON.parse(body).username).to.be.equal('test');
                }
            );
        });
        it('should create one member', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: 45,
                    username: 'Created Member',
                    password: 'pass',
                    email: 'email@gmail.com'
                })
            };
            request.post(
                'http://localhost:3000/api/v1/member',
                options,
                (error, response, body) => {
                    const newObject = JSON.parse(body);
                    expect(newObject.id).to.be.equal(45);
                    expect(newObject.username).to.be.equal('Created Member');
                    expect(newObject.email).to.be.equal('email@gmail.com');
                }
            );
        });
        it('should update one member', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'New username'
                })
            };
            request.put(
                'http://localhost:3000/api/v1/member/1',
                options,
                (error, response, body) => {
                    expect(response.statusCode).to.be.equal(200);
                }
            );
        });
        it('should delete a member', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            };
            request.delete(
                'http://localhost:3000/api/v1/member/2',
                options,
                (error, response, body) => {
                    expect(response.statusCode).to.be.equal(200);
                }
            );
        });
    });
    describe('workflow', () => {
        it('should get all workflows', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            };
            request.get(
                'http://localhost:3000/api/v1/workflow',
                options,
                (error, response, body) => {
                    expect(JSON.parse(body).length).to.be.equal(3);
                }
            );
        });
        it('should get one workflow', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            };
            request.get(
                'http://localhost:3000/api/v1/workflow/2',
                options,
                (error, response, body) => {
                    expect(JSON.parse(body).name).to.be.equal('A Workflow');
                }
            );
        });
        it('should create one workflow', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: 15,
                    name: 'Created Workflow'
                })
            };
            request.post(
                'http://localhost:3000/api/v1/workflow',
                options,
                (error, response, body) => {
                    const newObject = JSON.parse(body);
                    expect(newObject.id).to.be.equal(15);
                    expect(newObject.name).to.be.equal('Created Workflow');
                }
            );
        });
        it('should update one workflow', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Workflow Name Changed'
                })
            };
            request.put(
                'http://localhost:3000/api/v1/workflow/1',
                options,
                (error, response, body) => {
                    expect(response.statusCode).to.be.equal(200);
                }
            );
        });
        it('should delete a workflow', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            };
            request.delete(
                'http://localhost:3000/api/v1/workflow/15',
                options,
                (error, response, body) => {
                    expect(response.statusCode).to.be.equal(200);
                }
            );
        });
    });
    describe('state', () => {
        it('should get all states', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            };
            request.get('http://localhost:3000/api/v1/state', options, (error, response, body) => {
                expect(JSON.parse(body).length).to.be.equal(2);
            });
        });
        it('should get one state', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            };
            request.get(
                'http://localhost:3000/api/v1/state/2',
                options,
                (error, response, body) => {
                    expect(JSON.parse(body).name).to.be.equal('Test State 2');
                }
            );
        });
        it('should create one state', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: 15,
                    name: 'Created State',
                    workflowid: 2
                })
            };
            request.post('http://localhost:3000/api/v1/state', options, (error, response, body) => {
                const newObject = JSON.parse(body);
                expect(newObject.id).to.be.equal(15);
                expect(newObject.name).to.be.equal('Created State');
            });
        });
        it('should update one state', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'State Name Changed'
                })
            };
            request.put(
                'http://localhost:3000/api/v1/state/1',
                options,
                (error, response, body) => {
                    expect(response.statusCode).to.be.equal(200);
                }
            );
        });
        it('should delete a state', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            };
            request.delete(
                'http://localhost:3000/api/v1/state/15',
                options,
                (error, response, body) => {
                    expect(response.statusCode).to.be.equal(200);
                }
            );
        });
    });
    describe('button', () => {
        it('should get all button', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            };
            request.get('http://localhost:3000/api/v1/button', options, (error, response, body) => {
                expect(JSON.parse(body).length).to.be.equal(1);
            });
        });
        it('should get one button', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            };
            request.get(
                'http://localhost:3000/api/v1/button/1',
                options,
                (error, response, body) => {
                    expect(JSON.parse(body).text).to.be.equal('Button');
                }
            );
        });
        it('should create one button', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: 2,
                    text: 'Created Button',
                    stateid: 1
                })
            };
            request.post(
                'http://localhost:3000/api/v1/button',
                options,
                (error, response, body) => {
                    const newObject = JSON.parse(body);
                    expect(newObject.id).to.be.equal(2);
                    expect(newObject.text).to.be.equal('Created Button');
                }
            );
        });
        it('should update one button', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: 'Button Text Changed'
                })
            };
            request.put(
                'http://localhost:3000/api/v1/button/1',
                options,
                (error, response, body) => {
                    expect(response.statusCode).to.be.equal(200);
                }
            );
        });
        it('should delete a button', function(done) {
            this.timeout(1000);
            setTimeout(done, 50);
            const options = {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            };
            request.delete(
                'http://localhost:3000/api/v1/button/2',
                options,
                (error, response, body) => {
                    expect(response.statusCode).to.be.equal(200);
                }
            );
        });
    });
});
