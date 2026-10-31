const AWS = require('aws-sdk');

let sesClient;

const getSES = () => {
    if (!sesClient) {
        const isOffline = process.env.IS_OFFLINE || process.env.AWS_SAM_LOCAL || process.env.NODE_ENV === 'development';

        const sesOptions = isOffline ? {
            region: 'us-east-1',
            accessKeyId: 'MOCK_ACCESS_KEY',
            secretAccessKey: 'MOCK_SECRET_KEY',
            endpoint: 'http://localhost:8000'
        } : {};
        sesClient = new AWS.SES(sesOptions);
    }
    return sesClient;
};

const SOURCE_EMAIL = process.env.SOURCE_EMAIL;

const emailService = {
    async sendConfirmationEmail(patientEmail, patientName) {
        const isOffline = process.env.IS_OFFLINE || process.env.AWS_SAM_LOCAL || process.env.NODE_ENV === 'development';
        if (isOffline) {
            console.log(`[OFFLINE SES] To: ${patientEmail}, Name: ${patientName}`);
            return Promise.resolve();
        }
        const params = {
            Source: SOURCE_EMAIL,
            Destination: {
                ToAddresses: [patientEmail]
            },
            Message: {
                Subject: {
                    Data: 'Appointment Confirmed'
                },
                Body: {
                    Text: {
                        Data: `Dear ${patientName},\n\nYour appointment has been confirmed.\n\nThank you.`
                    }
                }
            }
        };
        return await getSES().sendEmail(params).promise();
    }
};

module.exports = emailService;
