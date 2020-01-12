import React from 'react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import { GiRss } from 'react-icons/gi';

// Converts a string from the full name to the style name; ex: 'Pink Line' -> 'pink-line'.
const lineToStyle = line => line.toLowerCase().replace(' ', '-');

const TrainList = props => (
  <ListGroup variant={'flush'}>
    {props.etas.map(eta => (
      <ListGroup.Item key={eta.id} className={lineToStyle(eta.lineName)}>
        <Container>
          <Row className="align-middle">
            <Col xs={12}>
              {eta.lineName} #{eta.trainNumber} to
            </Col>
            <Col xs={12} style={{ fontSize: '1.75rem' }}>
              {eta.destination}
            </Col>
            <Col>
              {/* If the train is flagged as Due, insert "Due" instead of the difference in time. */}
              {eta.due ? (
                <span className="font-weight-bold">Due</span>
              ) : (
                <span className="font-weight-bolder">
                  {Math.round((new Date(eta.eta) - new Date()) / 1000 / 60)}{' '}
                  <span className="font-weight-normal">
                    min <GiRss style={{ marginLeft: '0.5rem' }} />
                  </span>
                </span>
              )}
            </Col>
          </Row>
        </Container>
      </ListGroup.Item>
    ))}
  </ListGroup>
);

export default TrainList;
