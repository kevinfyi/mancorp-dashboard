const { google } = require('googleapis');

exports.handler = async (event, context) => {
  try {
    console.log('Starting write-data function execution...');
    
    // Ensure it's a POST request
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed. Use POST request.' }),
      };
    }

    // Parse the incoming request body
    const { formId, values } = JSON.parse(event.body);

    // Validate the input
    if (!formId || !values) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing formId or values in the request' }),
      };
    }

    // Authenticate with Google Sheets API
    const key = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({
      credentials: key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const client = await auth.getClient();
    const sheets = google.sheets('v4');

    const spreadsheetId = '1TZHLzn02cE_WnkzZSnvEvZcpBWVP5Atx9l4x4jopPho';  // Replace with your actual spreadsheet ID

    // Define the ranges for each form based on the formId
    let range;
    switch (formId) {
      case 'form1':
        range = 'Cleaning Jobs!A2:F'; 
        break;
      case 'form2':
        range = 'Companies!A2:D'; 
        break;
      case 'form3':
        range = 'Sheet3!A2:C'; 
        break;
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid formId provided.' }),
        };
    }

    // Append the data to the correct sheet based on formId
    const appendResult = await sheets.spreadsheets.values.append({
      auth: client,
      spreadsheetId,
      range, // The range defined for the form
      valueInputOption: 'USER_ENTERED', // Use USER_ENTERED for user-like input (formats applied automatically)
      resource: {
        values: [values], // Ensure values is an array
      },
    });

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({ result: 'Data successfully appended', appendResult }),
    };

  } catch (error) {
    console.error('Error occurred:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
