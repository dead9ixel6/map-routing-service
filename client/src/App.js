import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [directions, setDirections] = useState(null);

  const getDirections = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/directions?origin=${origin}&destination=${destination}`);
      const { routes } = response.data;
      const parsedRoutes = routes.map((route, i) => {
        const { legs } = route;
        if (legs.length > 0) {
          const { distance, duration } = legs[0];
          return {
            routeId: i,
            distance: distance.text,
            duration: duration.text,
          };
        }
        return null;
      });
      setRoutes(parsedRoutes.filter(Boolean));
      setSelectedRoute(null); // Reset selected route
    } catch (error) {
      console.error(error);
    }
  };

  const getRouteDetails = async (routeId) => {
    try {
      const response = await axios.get(`http://localhost:5000/directions?origin=${origin}&destination=${destination}`);
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
          }));
          setDirections(directions);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app-container">
      <h1>Routing Service</h1>
      <div className="form-container">
        <input type="text" placeholder="Origin" value={origin} onChange={(e) => setOrigin(e.target.value)} />
        <input type="text" placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
        <button onClick={getDirections}>Get Directions</button>
      </div>
      <div className="routes-container">
        {routes &&
          routes.map(({ routeId, distance, duration }) => (
            <div key={routeId} className="route-card" onClick={() => getRouteDetails(routeId)}>
              <h2>Route {routeId + 1}</h2>
              <p>Distance: {distance}</p>
              <p>Duration: {duration}</p>
            </div>
          ))}
      </div>
      <div className="directions-container">
        {directions &&
          directions.map(({ step, instruction, distance, duration }) => (
            <div key={step} className="directions-card">
              <h2>Step {step}</h2>
              <p dangerouslySetInnerHTML={{ __html: instruction }}></p>
              <p>Distance: {distance}</p>
              <p>Duration: {duration}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default App;
