import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAKW7awwtDt3YBTx7LgzThVXL26De6zPt8",
  authDomain: "map-routing-service.firebaseapp.com",
  projectId: "map-routing-service",
  storageBucket: "map-routing-service.appspot.com",
  messagingSenderId: "1007713910064",
  appId: "1:1007713910064:web:5f5e017dfb6ef203a75cf5"
};

firebase.initializeApp(firebaseConfig);

const useStyles = makeStyles((theme) => ({
  stepCard: {
    '&.green': {
      backgroundColor: '#b7e1cd',
    },
    '&.yellow': {
      backgroundColor: '#ffe8a6',
    },
    '&.red': {
      backgroundColor: '#f8c0c0',
    },
  },
}));

const App = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [directions, setDirections] = useState(null);
  const [isForceGoogleAPI, setIsForceGoogleAPI] = useState(false);
  const [dataSource, setDataSource] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
  }, []);

  const authenticate = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  };

  const signOut = () => {
    firebase.auth().signOut();
  };

  const getDirections = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        console.log('User is not authenticated');
        return;
      }

      // Proceed with the API request
      const response = await axios.get(
        `http://localhost:5000/directions?origin=${origin}&destination=${destination}&forceGoogleAPI=${isForceGoogleAPI}`
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
      setDataSource(response.data.dataSource); // Set the data source
    } catch (error) {
      console.error(error);
    }
  };

  const getRouteDetails = async (routeId) => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        console.log('User is not authenticated');
        return;
      }

      // Proceed with the API request
      const response = await axios.get(
        `http://localhost:5000/directions?origin=${origin}&destination=${destination}&forceGoogleAPI=${isForceGoogleAPI}`
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
            duration: step.duration.text,
            color:
              routeId < 3
                ? ['green', 'yellow', 'red'][routeId]
                : 'red'
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
      {isAuthenticated ? (
        <>
          {/* Display the data source */}
          {dataSource && (
            <Typography variant="subtitle1" gutterBottom>
              Data Source: {dataSource}
            </Typography>
          )}
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
              {isForceGoogleAPI ? 'Get Real-time Directions' : 'Get Directions'}
            </Button>
            <div>
              <input
                type="checkbox"
                checked={isForceGoogleAPI}
                onChange={() => setIsForceGoogleAPI(!isForceGoogleAPI)}
              />
              <label>Use Real-time Data</label>
            </div>
            <Button variant="contained" color="primary" onClick={signOut}>
              Sign Out
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
              directions.map(({ step, instruction, distance, duration, color }) => (
                <Card key={step} className={`directions-card ${color}`}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Step {step}
                    </Typography>
                    <Typography
                      variant="body2"
                      dangerouslySetInnerHTML={{ __html: instruction }}
                    />
                    <Typography variant="body2">Distance: {distance}</Typography>
                    <Typography variant="body2">Duration: {duration}</Typography>
                  </CardContent>
                </Card>
              ))}
          </Box>
        </>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom>
            Please sign in to use the Routing Service.
          </Typography>
          <Button variant="contained" color="primary" onClick={authenticate}>
            Sign In with Google
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default App;
