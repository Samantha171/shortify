const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
app.set('trust proxy', true);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

