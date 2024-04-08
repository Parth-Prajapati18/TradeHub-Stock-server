const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = corsOptions;
