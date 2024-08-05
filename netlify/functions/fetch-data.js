const { google } = require('googleapis');

exports.handler = async (event, context) => {
    try {
        // Log the environment variable to ensure it is loaded correctly
        console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

        // Parse the credentials
        const key = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
        console.log('Parsed credentials:', key);

        // Initialize the Google Sheets API client
        const sheets = google.sheets('v4');
        console.log('Google Sheets API client initialized.');

        // Set up authentication
        const auth = new google.auth.GoogleAuth({
            credentials: key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
        console.log('GoogleAuth instance created.');

        // Get the authenticated client
        const client = await auth.getClient();
        console.log('Authenticated client obtained.');

        const spreadsheetId = '1TZHLzn02cE_WnkzZSnvEvZcpBWVP5Atx9l4x4jopPho'; 
        const range = 'Sheet1!K:M'; 

        console.log('Fetching data from spreadsheet:', { spreadsheetId, range });

        // Fetch data from the Google Sheets API
        const response = await sheets.spreadsheets.values.get({
            auth: client,
            spreadsheetId,
            range,
        });
        console.log('Data fetched from Google Sheets:', response.data);

        const rows = response.data.values || [];
        console.log('Rows data:', rows);

        if (rows.length) {
            return {
                statusCode: 200,
                body: JSON.stringify({ rows }),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'No data found' }),
            };
        }
    } catch (error) {
        console.error('Error occurred:', error); // Log detailed error information
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
