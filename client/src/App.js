import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import './App.css';

const App = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [directions, setDirections] = useState(null);

  const getDirections = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/directions?origin=${origin}&destination=${destination}`
      );
      const { routes } = response.data;
      const parsedRoutes = routes.map((route, i) => {
        const { legs } = route;
        if (legs.length > 0) {
          const { distance, duration } = legs[0];
          return {
            routeId: i,
            distance: distance.text,
            duration: duration.value // Using duration value for comparison
          };
        }
      });
      setRoutes(parsedRoutes);
      setSelectedRoute(null); // Reset selected route
    } catch (error) {
      console.error(error);
    }
  };

  const getRouteDetails = async (routeId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/directions?origin=${origin}&destination=${destination}`
      );
      const { routes } = response.data;
      if (routes.length > routeId) {
        const { legs } = routes[routeId];
        if (legs.length > 0) {
          const { distance, duration, steps } = legs[0];
          const directions = steps.map((step, i) => ({
            step: i + 1,
            instruction: step.html_instructions,
            distance: step.distance.text,
            duration: step.duration.text
          }));
          setDirections(directions);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCardClassName = (routeId, duration) => {
    if (selectedRoute === routeId) {
      return 'route-card route-card-selected';
    }
    if (duration === Math.min(...routes.map((route) => route.duration))) {
      return 'route-card route-card-fastest';
    }
    if (duration === Math.max(...routes.map((route) => route.duration))) {
      return 'route-card route-card-slowest';
    }
    return 'route-card';
  };

  return (
    <Container className="app-container">
      <Typography variant="h4" component="h1" gutterBottom>
        Routing Service
      </Typography>
      <Box className="form-container">
        <TextField
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          label="Origin"
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <TextField
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          label="Destination"
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={getDirections}>
          Get Directions
        </Button>
      </Box>
      <Box className="routes-container">
        {routes &&
          routes.map(({ routeId, distance, duration }) => (
            <Card
              key={routeId}
              className={getCardClassName(routeId, duration)}
              onClick={() => getRouteDetails(routeId)}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  Route {routeId + 1}
                </Typography>
                <Typography variant="body2">
                  Distance: {distance}
                </Typography>
                <Typography variant="body2">
                  Duration: {duration}
                </Typography>
              </CardContent>
            </Card>
          ))}
      </Box>
      <Box className="directions-container">
        {directions &&
          directions.map(({ step, instruction, distance, duration }) => (
            <Card key={step} className="directions-card">
              <CardContent>
                <Typography variant="h5" component="div">
                  Step {step}
                </Typography>
                <Typography
                  variant="body2"
                  dangerouslySetInnerHTML={{ __html: instruction }}
                />
                <Typography variant="body2">
                  Distance: {distance}
                </Typography>
                <Typography variant="body2">
                  Duration: {duration}
                </Typography>
              </CardContent>
            </Card>
          ))}
      </Box>
    </Container>
  );
};

export default App;
