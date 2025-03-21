const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.json());


// Middleware CORS setup
const FRONTEND_URL = 'https://thankful-sand-02d2aac10.6.azurestaticapps.net';
app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// Homepage
app.get('/', (req, res) => {

    res.send(`
        <h1 style="text-align: center;">Welcome to HIRisk API Homepage!!</h1>
        <p style="text-align: center;">To access the API, use /api/calculate-risk from frontend!</p>
    `);
});


// bmi calculator function
function calculateBMI(weight, height){
    const weightKG = (weight * 0.45359237);
    const heightMeters = (height * 0.0254);
    return (weightKG / (heightMeters ** 2)).toFixed(1);
}


// Determining risk points
function calculateRiskPoints({ age, weight, height, bloodPressure, familyHistory = [] }){
    
    let riskPoints = 0;

    // Age Risk
    if (age < 30) riskPoints += 0;
    else if (age < 45) riskPoints += 10;
    else if (age < 60) riskPoints += 20;
    else riskPoints += 30;

    // BMI Risk
    const bmi = calculateBMI(weight, height);
    if (bmi >= 18.5 && bmi <= 24.9) riskPoints += 0;
    else if (bmi >= 25.0 && bmi <= 29.9) riskPoints += 30;
    else riskPoints += 75;


    // Blood Pressure Risk
    const bpRisk = {
        "normal": 0,
        "elevated": 15,
        "stage1": 30,
        "stage2": 75,
        "crisis": 100
    };

    riskPoints += bpRisk[bloodPressure] || 0; // Just incase it's undefined


    // Family History Risk. Keys are matching the frontend values for familyDiseases
    const familyHistoryRisk = {
        "diabetes": 10,
        "cancer": 10,
        "alzheimers": 10,
    };

    familyHistory.forEach(condition => {
        riskPoints += familyHistoryRisk[condition] || 0; // Just incase it's undefined
    });


    // Determining Results
    let riskCategory = "Low Risk"

    if (riskPoints <= 20){
        riskCategory = "Low Risk";
    } else if (riskPoints <= 50){
        riskCategory = "Moderate Risk";
    } else if (riskPoints <= 75){
        riskCategory = "High Risk";
    } else {
        riskCategory = "Uninsurable";
    }
    
    return { riskPoints, riskCategory }

}


// bmi calculator
app.post('/api/calculate-risk', (req, res) =>{
    const {age, weight, heightFeet, heightInches, bloodPressure, familyDiseases} = req.body;

    // Validating all fields
    if(!age || !weight || !heightFeet || !heightInches || !bloodPressure || !Array.isArray(familyDiseases)){
        return res.status(400).json({error: "Please fill out all fields."});
    }

    const height = heightFeet * 12 + heightInches;
    const result = calculateRiskPoints({ age, weight, height, bloodPressure, familyHistory: familyDiseases });

    const { riskPoints, riskCategory } = result;

    res.json({ totalRiskPoints: riskPoints, riskCategory });
});


// PORT for the server
app.listen(PORT, () => {
    console.log(`Backend API running on port ${PORT}!`);
});
