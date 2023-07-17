require('dotenv').config()
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const GOOGLE_API_KEY  = 'AIzaSyCB33Vn5u3Mtd0H6oGOwGgpgq2SFJRIPrs'; 

app.use(cors(GOOGLE_API_KEY ));


app.get('/directions', async (req, res) => {
    const { origin, destination } = req.query;

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_API_KEY}&alternatives=true`);
        res.json(response.data);
        
    } catch (error) {
        res.json({ error: error.message });
    }
});

app.get('/distancematrix', async (req, res) => {
    const { origins, destinations } = req.query;

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${GOOGLE_API_KEY}`);
        res.json(response.data);
    } catch (error) {
        res.json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
    console.log(GOOGLE_API_KEY )
    console.log(`Server is running on port ${PORT}`);
});
