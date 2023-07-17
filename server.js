require('dotenv').config()
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const app = express();
const { Route, Direction } = require('./models/models');
const GOOGLE_API_KEY  = 'AIzaSyCB33Vn5u3Mtd0H6oGOwGgpgq2SFJRIPrs'; 

app.use(cors(GOOGLE_API_KEY ));

const MONGODB_URI = 'mongodb://127.0.0.1:27017/routing-service'; // Replace with your MongoDB connection URI

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));



app.get('/directions', async (req, res) => {
    const { origin, destination } = req.query;
  
    try {
      // Check if the route already exists in the database
      const existingRoute = await Route.findOne({ origin, destination });
  
      if (existingRoute) {
        // Route exists, retrieve and send the stored data
        console.log('we are using mongo')
        const { data } = existingRoute;
        res.json(data);
      } else {
        // Route does not exist, make a request to the Google Maps API
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_API_KEY}&alternatives=true`
        );
        const { routes } = response.data;
            console.log('we are using google api')
        // Store the route in the database
        const route = new Route({
          origin,
          destination,
          data: response.data,
        });
        await route.save();
  
        // Send the response
        res.json(response.data);
      }
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
