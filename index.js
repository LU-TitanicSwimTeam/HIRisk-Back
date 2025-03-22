const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5500;


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

    // Converting inputs to numbers if not already
    const weightNum = Number(weight);
    const heightNum = Number(height);

    const weightKG = (weightNum * 0.45359237);
    const heightMeters = (heightNum * 0.0254);

    // Returning as a number for correct comparisions later on
    return Number((weightKG / (heightMeters ** 2)).toFixed(1));
}


// Determining risk points
function calculateRiskPoints({ age, weight, height, bloodPressure, familyHistory = [] }){
    
    // Convert to Numbers if not already
    const ageNum = Number(age);
    const weightNum = Number(weight);
    const heightNum = Number(height);

    let riskPoints = 0;

    // Age Risk
    if (ageNum < 30) {
        riskPoints += 0;
    } else if (ageNum < 45){
        riskPoints += 10;
    } else if (ageNum < 60){
        riskPoints += 20;
    } else {
        riskPoints += 30;
    }

    // BMI Risk
    const bmi = calculateBMI(weightNum, heightNum);
    if (bmi >= 18.5 && bmi <= 24.9) {
        riskPoints += 0;
    } else if (bmi >= 25.0 && bmi <= 29.9){ 
        riskPoints += 30
    } else{ 
        riskPoints += 75
    };


    // Blood Pressure Risk
    const bpRisk = {
        "normal": 0,
        "elevated": 15,
        "stage1": 30,
        "stage2": 75,
        "crisis": 100
    };

    const bpPoints = bpRisk[bloodPressure] || 0; // Just incase it's undefined
    riskPoints += bpPoints;


    // Family History Risk
    const familyHistoryRisk = {
        "diabetes": 10,
        "cancer": 10,
        "alzheimers": 10,
    };

    let familyPoints = 0;

    familyHistory.forEach(condition => {
        const points = familyHistoryRisk[condition] || 0; // Just incase it's undefined
        familyPoints += points;
    });

    riskPoints += familyPoints;

    // Determining Results
    let riskCategory = "Low Risk";

    // replaced original with a bit more structured risk calculator.
    if (riskPoints <= 20){
        riskCategory = "Low Risk";
    } else if (riskPoints <= 50){
        riskCategory = "Moderate Risk";
    } else if (riskPoints <= 75){
        riskCategory = "High Risk";
    } else {
        riskCategory = "Uninsurable";
    }

    return { riskPoints, riskCategory };

}


// bmi calculator
app.post('/api/calculate-risk', (req, res) =>{
    const {age, weight, heightFeet, heightInches, bloodPressure, familyDiseases} = req.body;

    // Validating all fields
    if(!age || !weight || !heightFeet || !heightInches || !bloodPressure || !Array.isArray(familyDiseases)){
        return res.status(400).json({error: "Please fill out all fields."});
    }

    const heightFeetNum = Number(heightFeet);
    const heightInchesNum = Number(heightInches);
    const totalHeight = (heightFeetNum * 12) + heightInchesNum;

    const result = calculateRiskPoints({ age, weight, height: totalHeight, bloodPressure, familyHistory: familyDiseases });

    const { riskPoints, riskCategory } = result;

    res.json({ totalRiskPoints: riskPoints, riskCategory });
});


// PORT for the server
app.listen(PORT, () => {
    console.log(`Backend API running on port ${PORT}!`);
});
