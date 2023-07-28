const chai = require('chai');
const nock = require('nock');
const HttpClient = require('../../src/http/client');

const expect = chai.expect;

describe('HttpClient integration test', () => {
	it('should make an HTTP request', async () => {
		// Set up a nock interceptor
		nock('http://test.com')
			.get('/')
			.reply(200, 'Hello, world!');

		const client = new HttpClient();
		const request = {
			method: 'get',
			url: 'http://test.com'
		};

		const response = await client.send(request);

		expect(response.status).to.equal(200);
		expect(response.data).to.equal('Hello, world!');
	});
});
