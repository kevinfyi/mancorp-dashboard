// fetch-data.js (Netlify Function)
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const response = await fetch('1TZHLzn02cE_WnkzZSnvEvZcpBWVP5Atx9l4x4jopPho');
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
