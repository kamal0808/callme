const logger = require('winston-logstash-transporter')(__filename);
const fetch = require('axios');
const _ = require('lodash');
/**
 * Send a request
 * @param method
 * @param url
 * @param headers
 * @param body
 * @returns {*|Promise|{enumerable}}
 */
async function sendRequest(method, url, headers, body) {
  logger.debug({message: 'Sending '})
  try {
    if (!(method && url)) {
      logger.error({
        message: 'Method, url & token are required for sending request',
        method,
        url,
        token,
        body,
      });
      throw new Error('Method, url & token are required for sending request');
    }
    const opts = {};
    opts.method = method;
    headers ? opts.headers = headers : true;
    if (method !== 'get' && method !== 'delete') {
      // body && body instanceof URLSearchParams ? opts.body = body : opts.body = JSON.stringify(body);
      opts.body = body && _.isObject(body) ? JSON.stringify(body) : body;
      console.log('body', _.isObject(body));
      if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        var formBody = [];
        for (const property in body) {
          console.log('property', property);
          const encodedKey = encodeURIComponent(property);
          const encodedValue = encodeURIComponent(_.isObject(body[property]) ? JSON.stringify(body[property]) : body[property]);
          console.log('encodeed', encodedKey, encodedValue);
          formBody.push(`${encodedKey}=${encodedValue}`);
        }
        formBody = formBody.join('&');
      }
      opts.body = formBody || opts.body;
      console.log('opts.body', opts.body);
    }

    // body ? opts.body = JSON.stringify(body) : '';
    logger.debug({
      message: 'Sending this network request',
      method,
      url,
      ...opts,
    });
    const request = await fetch(url, {
      method,
      ...opts,
    });
    logger.debug({
      message: 'Sent request',
      method,
      url,
      ...opts,
      request,
      status: request.status,
      statusText: request.statusText,
    });
    let res;
    try {
      if (opts.headers?.Accept && opts.headers?.Accept === "audio/mpeg") {
        const blob = await request.blob();
        // const url = URL.createObjectURL(blob);
        // res = blob;
        // res.type(blob.type);
        let arrayBuffer = await blob.arrayBuffer()
        res = Buffer.from(arrayBuffer);
      }
      else
        res = await request.json();
    } catch (error) {
      try {
        logger.error({
          message: 'Error occurred parsing response',
          error
        });
        res = await request.text();
      } catch (e) {
        logger.error({
          message: 'Error occurred parsing response',
          e
        });
        res = 'No response from request, just acknowledgment code';
      }
      console.log('is text');
    }
    logger.debug({
      message: 'Received network response ',
      res,
      ...opts,
      status: request.status,
    });
    if (request.status >= 200 && request.status < 300) {
      return res;
    }

    throw res;
  } catch (error) {
    console.log('error', error)
    logger.error({
      message: 'Error sending request',
      error,
      method,
      url,
      body,
    });
    throw error;
  }
}

module.exports = {
  sendRequest,
};
