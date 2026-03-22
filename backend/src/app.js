process.env.TZ = 'Asia/Kolkata';
const express = require('express');
const cors = require('cors');
const authRoutes = require('./modules/auth/auth.routes');
const urlRoutes = require('./modules/url/url.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');
const publicRoutes = require('./modules/public/public.routes');
const { redirect } = require('./modules/url/url.controller');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/public', publicRoutes);

// Redirect Route
app.get('/r/:short_code', redirect);

app.get('/', (req, res) => {
    res.send('Shortify API is running...');
});

module.exports = app;
