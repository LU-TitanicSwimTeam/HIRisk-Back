const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();

let heightInches = 0

let weightLBS = 0

let bmi = 0

// We will eventually have a html file for a homepage, api pages, and common error pages like 404 or 403. 
app.get('/', (req, res) => {
    res.send('<h1 style="text-align: center;">Welcome to HIRisk API Homepage!!</h1><p style="text-align: center;">APIs are yet to be implemented for HIRisk.</p>' +
       // creating a basic input just to see if it works
        '<hr/>>' +

        '<p>Height: </p><input type="text">');
});

app.listen(PORT, () => {
    console.log(`Backend API running on port ${PORT}!`);
})


// bmi calculator
.app('/bmi', (req, res) => {
    bmi = weightLBS / (heightInches * heightInches)
    res.send('<h1>Testing BMI: ${bmi}</h1>');

})