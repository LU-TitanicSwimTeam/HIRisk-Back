const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// CORS setup
const FRONTEND_URL = 'https://thankful-sand-02d2aac10.6.azurestaticapps.net';
app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// We will eventually have a html file for a homepage, api pages, and common error pages like 404 or 403. 
app.get('/', (req, res) => {

    res.send(`
        <h1 style="text-align: center;">Welcome to HIRisk API Homepage!!</h1>
        <p style="text-align: center;">APIs are yet to be implemented for HIRisk.</p>
    `);
});


// bmi calculator
app.post('/api/calculate-risk', (req, res) =>{
    const {heightFeet, heightInches, weight} = req.body;

    if(!heightFeet || !heightInches || !weight){
        return res.status(400).json({error: "Please fill out all fields."});
    }

    const heightInInches = (parseInt(heightFeet) * 12) + parseInt(heightInches);

    const bmi = (weight / (heightInInches ** 2)) * 703;

    //Dummy Risk Calculation to see if works
    const riskScore = bmi * 2;

    res.json({ riskScore });
})

app.listen(PORT, () => {
    console.log(`Backend API running on port ${PORT}!`);
})
