const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();

let heightInches = 70

let weightLBS = 100

let bmi = 0


// We will eventually have a html file for a homepage, api pages, and common error pages like 404 or 403. 
app.get('/', (req, res) => {
    bmi = (weightLBS / (heightInches * heightInches) * 703)

    res.send('<h1 style="text-align: center;">Welcome to HIRisk API Homepage!!</h1><p style="text-align: center;">APIs are yet to be implemented for HIRisk.</p>' +
       // creating a basic input just to see if it works
        '<hr/>>' +

        '<p">Height: ${heightInches} inches</p>' +
        '<p>Weight: ${weightLBS} LBS</p>' +
        '<p>BMI: ${bmi.toFixed(2)}</p>');

});

app.listen(PORT, () => {
    console.log(`Backend API running on port ${PORT}!`);
})


// bmi calculator

