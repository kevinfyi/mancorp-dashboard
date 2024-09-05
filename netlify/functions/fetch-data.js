const { google } = require('googleapis');
const NodeCache = require('node-cache');

// Create a cache with a default TTL of 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

exports.handler = async (event, context) => {
  try {
    console.log('Starting function execution...');
    
    const forceRefresh = event.queryStringParameters && event.queryStringParameters.refresh === 'true';
    // Check if we have cached data
    if (!forceRefresh) {
        const cachedData = cache.get('sheetData');
        if (cachedData) {
          console.log('Returning cached data');
          return {
            statusCode: 200,
            body: JSON.stringify(cachedData),
          };
        }
      }

    // Fetched ranges
    const ranges = [
      'Processed Concerns!A2:D',
      'Cleaning Jobs!A2:D',
      'Companies!A2:C',
      'Dashboard!K2:L3',
      'Dashboard!K7:L7',
      'Dashboard!M8',
      'Dashboard!B2:H2',
      'Dashboard!B3:H3',
      'Dashboard!N5:Y5'
    ];

    const key = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({
      credentials: key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const client = await auth.getClient();
    
    const sheets = google.sheets('v4');
    
    const spreadsheetId = '1TZHLzn02cE_WnkzZSnvEvZcpBWVP5Atx9l4x4jopPho';
    
    console.log('Fetching data from spreadsheet with batchGet:', { spreadsheetId, ranges });
    
    const batch = await sheets.spreadsheets.values.batchGet({
      auth: client,
      spreadsheetId,
      ranges: ranges,
    });

    const response = batch.data;
    
    if (!response || !response.valueRanges) {
      throw new Error('No data received from the batchGet request');
    }

    const rows = response.valueRanges.slice(0, 3).map(range => range.values || []);
    const cellValues = response.valueRanges.slice(3).flatMap(range => range.values ? range.values.flat() : []);

    console.log('Rows data:', rows);
    console.log('Cell data:', cellValues);

    const result = { rows, cellValues };

    // Cache the result
    cache.set('sheetData', result);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error occurred:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

