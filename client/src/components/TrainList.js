import React from 'react';
import { ListGroup } from 'react-bootstrap';

// Converts a string from the full name to the style name; ex: 'Pink Line' -> 'pink-line'.
const lineToStyle = line => line.toLowerCase().replace(' ', '-');

const TrainList = props => (
  <ListGroup variant={'flush'}>
    {props.etas.map(eta => (
      <ListGroup.Item key={eta.id} className={lineToStyle(eta.lineName)}>
        {eta.due ? (
          <span className="font-weight-bold">Due</span>
        ) : (
          <div>
            <span className="font-weight-bold">
              {Math.round((new Date(eta.eta) - new Date()) / 1000 / 60)}{' '}
            </span>{' '}
            min
          </div>
        )}
      </ListGroup.Item>
    ))}
  </ListGroup>
);

export default TrainList;
