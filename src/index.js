const HttpClient = require('./http/client');

class Callme {
  constructor() {
    this.http = new HttpClient();
  }
}
