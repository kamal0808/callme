const axios = require('axios');

class HttpClient {
  constructor() {
    this.client = axios.create();
  }

  async send(request) {
    try {
      const response = await this.client(request);
      return response;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      throw error;
    }
  }
}
