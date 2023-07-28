const chai = require('chai');
const HttpClient = require('../src/http/client');

const expect = chai.expect;

describe('HttpClient', () => {
  it('should make an HTTP request', async () => {
    const client = new HttpClient();
    const request = {
      method: 'get',
      url: 'http://example.com'
    };

    const response = await client.send(request);

    expect(response.status).to.equal(200);
    expect(response.data).to.be.a('string');
  });
});
