const axios = require('axios');
const Bottleneck = require('bottleneck');

class HttpClient {
  constructor() {
    this.client = axios.create();

    // Create a new rate limiter
    this.limiter = new Bottleneck({
      minTime: 200, // Minimum time between requests
    });

    // Add interceptors
    this.client.interceptors.request.use(request => {
      console.log(`Sending request to ${request.url}`);
      return request;
    });

    this.client.interceptors.response.use(response => {
      console.log(`Received response from ${response.config.url}`);
      return response;
    });
  }

  setDefaultHeaders(headers) {
    this.client.defaults.headers.common = {...this.client.defaults.headers.common, ...headers};
  }

  setAuth(token) {
    this.setDefaultHeaders({ Authorization: `Bearer ${token}` });
  }

  async send(request) {
    try {
      // Wrap the request in the limiter
      const response = await this.limiter.schedule(() => this.client(request));
      return response;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = HttpClient;