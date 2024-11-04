const allowedOrigins = [
    'http://localhost:3500',
    'http://localhost:3000',
    'http://13.125.246.56:3000'
];
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials