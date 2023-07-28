/* eslint-disable no-undef */
const chai = require('chai');
const expect = chai.expect;
const nock = require('nock');
const HttpClient = require('../../src/http/client');

describe('HttpClient', function() {
	let httpClient;

	beforeEach(function() {
		httpClient = new HttpClient();
	});

	it('should send text correctly', async function() {
		nock('http://example.com')
			.post('/text', 'hello')
			.reply(200);

		let response = await httpClient.send({
			method: 'post',
			url: 'http://example.com/text',
			data: 'hello'
		});

		expect(response.status).to.equal(200);
	});

	it('should send JSON correctly', async function() {
		nock('http://example.com')
			.post('/json', { key: 'value' })
			.reply(200);

		let response = await httpClient.send({
			method: 'post',
			url: 'http://example.com/json',
			data: { key: 'value' }
		});

		expect(response.status).to.equal(200);
	});

	it('should send binary data correctly', async function() {
		let buffer = Buffer.from([0x01, 0x02, 0x03, 0x04]);

		nock('http://example.com')
			.post('/binary', buffer)
			.reply(200);

		let response = await httpClient.send({
			method: 'post',
			url: 'http://example.com/binary',
			data: buffer
		});

		expect(response.status).to.equal(200);
	});

	// Add more tests here for receiving data...
});
