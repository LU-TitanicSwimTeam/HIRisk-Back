const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();

// We will eventually have a html file for a homepage, api pages, and common error pages like 404 or 403. 
app.get('/', (req, res) => {
    res.send('<h1 style="text-align: center;">Welcome to HIRisk API Homepage!!</h1><p style="text-align: center;">APIs are yet to be implemented for HIRisk.</p>');
});

app.listen(PORT, () => {
    console.log(`Backend API running on port ${PORT}!`);
});