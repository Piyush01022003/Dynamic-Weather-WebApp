const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');


const app = express();
const port = 5000;
// Enable CORS for all routes
app.use(cors());  //Browser security policy allowing or restricting web page access to resources on another domain.
// Serve static files from the 'public' directory
app.use(express.static('public'));   // Middleware in Express.js serving static files from the 'public' directory.
const homefile = fs.readFileSync('public/home.html', 'utf-8');

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace('{%tempval%}', `${convertToCelsius(orgVal.main.temp)}&deg;C`);
    temperature = temperature.replace('{%feelsLike%}', `${convertToCelsius(orgVal.main.feels_like)}&deg;C`);
    temperature = temperature.replace('{%location%}', orgVal.name);
    temperature = temperature.replace('{%country%}', orgVal.sys.country);
    temperature = temperature.replace('{%tempstatus%}', orgVal.weather[0].main);
    return temperature;
};


convertToCelsius=(kelvinTemperature)=>{
    let celciusTemperature = kelvinTemperature-273.15;
    let roundedNumber=celciusTemperature.toFixed(2);
    return roundedNumber;
}

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=Patna&appid=d14b537678aa393f66d3f268fc13d42b');
        const objectdata = response.data;   //JavaScript library for making HTTP requests from browsers or Node.js.
        const arrData = [objectdata];

        const realTimeData = arrData.map((val) => replaceVal(homefile, val)).join('');

        console.log(realTimeData.main);
        res.send(realTimeData);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});



