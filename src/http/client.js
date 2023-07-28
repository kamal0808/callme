const axios = require('axios');
const Bottleneck = require('bottleneck');

/**
 * HttpClient is a class for making HTTP requests.
 * It has built-in features for rate limiting and error handling.
 */
class HttpClient {
	/**
   * The HttpClient constructor.
   */
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

	/**
   * Set default headers for all requests.
   * @param {Object} headers - An object representing the default headers.
   */
	setDefaultHeaders(headers) {
		this.client.defaults.headers.common = { ...this.client.defaults.headers.common, ...headers };
	}

	/**
   * Set the Authorization header for all requests.
   * @param {string} token - The token to be included in the Authorization header.
   */
	setAuth(token) {
		this.setDefaultHeaders({ Authorization: `Bearer ${token}` });
	}

	/**
 * Send an HTTP request.
 * @param {Object} request - The request configuration.
 * @param {string} request.method - The HTTP method (e.g., 'get', 'post').
 * @param {string} request.url - The URL to request.
 * @param {Object} [request.headers] - The headers to include in the request.
 * @param {Object} [request.params] - The query parameters to include in the request.
 * @param {string|Object|Buffer} [request.data] - The body of the request. Can be a string, an object, or a Buffer.
 * @returns {Promise<Object>} - The response from the server.
 */
	async send(request) {
		// Prepare the data to send
		let data;
		// eslint-disable-next-line no-undef
		if (Buffer.isBuffer(request.data)) {
			// If the data is a Buffer, send it as-is
			data = request.data;
		} else if (typeof request.data === 'object') {
			// If the data is an object, convert it to JSON
			data = JSON.stringify(request.data);
		} else {
			// If the data is a string, send it as-is
			data = request.data;
		}

		// Send the request
		let response = await this.limiter.schedule(() => axios({
			method: request.method,
			url: request.url,
			headers: request.headers,
			params: request.params,
			data: data
		}));

		return response;
	}
}

module.exports = HttpClient;