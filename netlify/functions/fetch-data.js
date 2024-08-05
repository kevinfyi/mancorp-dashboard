const { google } = require('googleapis');
const { withStatusCode } = require('@netlify/functions');

exports.handler = async (event, context) => {
    try {
        // Parse the JSON key from the environment variable
        const key = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

        const sheets = google.sheets('v4');

        // Load the service account key from the parsed JSON
        const auth = new google.auth.GoogleAuth({
            credentials: key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        // Create a client instance
        const client = await auth.getClient();

        // Get the data from Google Sheets
        const spreadsheetId = 'your-spreadsheet-id';
        const range = 'Sheet1!A:C';
        const response = await sheets.spreadsheets.values.get({
            auth: client,
            spreadsheetId,
            range,
        });

        const rows = response.data.values;

        if (rows.length) {
            return {
                statusCode: 200,
                body: JSON.stringify(rows),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'No data found' }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};



