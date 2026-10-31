process.env.IS_OFFLINE = 'true';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
process.env.USERS_TABLE = process.env.USERS_TABLE || 'local-users';
process.env.APPOINTMENTS_TABLE = process.env.APPOINTMENTS_TABLE || 'local-appointments';
process.env.SOURCE_EMAIL = process.env.SOURCE_EMAIL || 'test@example.com';

const http = require('http');
const { URL } = require('url');
const { handler } = require('./handler');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
    // Handle CORS preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST,GET,PUT,DELETE');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Read body
    let rawBody = '';
    req.on('data', chunk => {
        rawBody += chunk;
    });

    req.on('end', async () => {
        const fullUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        let cleanPath = fullUrl.pathname.replace(/^\/dev/, '');
        if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;

        let resource = cleanPath;
        let pathParameters = null;

        const apptMatch = cleanPath.match(/^\/appointments\/([^/]+)$/);
        if (apptMatch && !['doctor', 'patient'].includes(apptMatch[1])) {
            resource = '/appointments/{id}';
            pathParameters = { id: apptMatch[1] };
        }

        const userMatch = cleanPath.match(/^\/admin\/users\/([^/]+)$/);
        if (userMatch) {
            resource = '/admin/users/{id}';
            pathParameters = { id: userMatch[1] };
        }

        const event = {
            path: cleanPath,
            httpMethod: req.method,
            resource,
            headers: req.headers,
            body: rawBody || null,
            pathParameters,
            queryStringParameters: Object.fromEntries(fullUrl.searchParams.entries())
        };

        try {
            const result = await handler(event, {});
            const statusCode = result.statusCode || 200;
            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
                ...(result.headers || {})
            };

            res.writeHead(statusCode, headers);
            res.end(result.body || '');
        } catch (err) {
            console.error('Server Error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error', error: err.message }));
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n🏥 Backend API Server running at: http://localhost:${PORT}/dev`);
    console.log(`   Local DynamoDB/SES Emulation Active (Persistence in .local-db.json)\n`);
});
