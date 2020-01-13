import React from 'react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import EtaDisplay from './EtaDisplay';
import { IoMdAirplane as AirplaneIcon } from 'react-icons/io';

import { lineToStyle } from '../helpers';

const airports = ["O'Hare", 'Midway'];

const TrainList = props => (
  <ListGroup variant={'flush'}>
    {props.etas.map(eta => (
      <ListGroup.Item
        key={eta.id}
        className={`${lineToStyle(eta.lineName)} train-list`}
      >
        <Container>
          <Row>
            <Col xs={12} className="train-num">
              {eta.lineName} #{eta.trainNumber} to
            </Col>
            <Col xs={12} className="train-dest font-weight-bold">
              {eta.destination}
              {airports.includes(eta.destination) ? <AirplaneIcon /> : null}
            </Col>
            <Col xs={12}>
              <EtaDisplay
                due={eta.due}
                eta={eta.eta}
                generatedAt={eta.generatedAt}
                liveData={!eta.scheduled}
              />
            </Col>
          </Row>
        </Container>
      </ListGroup.Item>
    ))}
  </ListGroup>
);

export default TrainList;
