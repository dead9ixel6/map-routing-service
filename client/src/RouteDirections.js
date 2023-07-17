import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const RouteDirections = ({ steps }) => (
  <List>
    {steps.map((step, index) => (
      <ListItem key={index}>
        <ListItemText
          primary={`Step ${index + 1}`}
          secondary={step.html_instructions.replace(/<[^>]*>/g, '')}
        />
      </ListItem>
    ))}
  </List>
);

export default RouteDirections;
