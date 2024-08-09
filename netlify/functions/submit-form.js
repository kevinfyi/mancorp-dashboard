const { google } = require('googleapis');

exports.handler = async (event, context) => {
    try {
        // Log the environment variable to ensure it is loaded correctly
        console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

        // Parse the credentials
        const key = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

        // Initialize the Google Sheets API client
        const sheets = google.sheets('v4');

        // Set up authentication
        const auth = new google.auth.GoogleAuth({
            credentials: key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        // Get the authenticated client
        const client = await auth.getClient();

        // Get the form data from the request body
        const formData = JSON.parse(event.body);

        // Prepare the data to append (adjust according to your form fields)
        const values = [
            [formData.selectLarge, formData.selectSmall, formData.inputField]
        ];

        // Define the spreadsheetId and range
        const spreadsheetId = '1TZHLzn02cE_WnkzZSnvEvZcpBWVP5Atx9l4x4jopPho';
        const range = 'Processed Cleaning Jobs!A1'; // Adjust this range according to your needs

        // Append the new row
        await sheets.spreadsheets.values.append({
            auth: client,
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            resource: {
                values,
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Form submitted successfully!' }),
        };
    } catch (error) {
        console.error('Error occurred:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
