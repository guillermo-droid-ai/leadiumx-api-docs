const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve main documentation
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Redirect docs to root
app.get('/docs', (req, res) => {
    res.redirect('/');
});

// Health check endpoint (API)
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'LeadiumX AI API Documentation',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// API endpoint to get all endpoints
app.get('/api/v1/endpoints', (req, res) => {
    res.json({
        version: '1.0.0',
        endpoints: [
            {
                method: 'GET',
                path: '/v1/health',
                description: 'Check API health and status',
                category: 'System'
            },
            {
                method: 'POST',
                path: '/v1/calls',
                description: 'Initiate outbound voice calls via Retell AI',
                category: 'Voice',
                parameters: {
                    agent_id: 'string (required)',
                    from_number: 'string (required)',
                    to_number: 'string (required)',
                    agent_version: 'integer (optional)',
                    dynamic_vars_values: 'object (optional)'
                }
            },
            {
                method: 'POST',
                path: '/v1/messages/sms',
                description: 'Send SMS messages to prospects',
                category: 'SMS',
                parameters: {
                    phone_number: 'string (required)',
                    message: 'string (required)',
                    agent_id: 'string (optional)',
                    dynamic_vars_values: 'object (optional)'
                }
            },
            {
                method: 'POST',
                path: '/v1/messages/email',
                description: 'Send email campaigns',
                category: 'Email',
                parameters: {
                    email: 'string (required)',
                    subject: 'string (required)',
                    body: 'string (required)',
                    agent_id: 'string (optional)',
                    dynamic_vars_values: 'object (optional)'
                }
            }
        ]
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        path: req.path,
        message: 'Endpoint not found. Visit / for documentation or /api/v1/endpoints for API info'
    });
});

app.listen(PORT, () => {
    console.log(`✅ LeadiumX API Documentation Server running on port ${PORT}`);
    console.log(`📖 Documentation: http://localhost:${PORT}`);
    console.log(`🔌 API Endpoints: http://localhost:${PORT}/api/v1/endpoints`);
});
