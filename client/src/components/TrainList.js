import React from 'react';
import { Col, ListGroup, Modal, Row } from 'react-bootstrap';

import { FaWheelchair as AccessibleIcon } from 'react-icons/fa';
import { IoMdAirplane as AirplaneIcon } from 'react-icons/io';
import { FiExternalLink as LinkIcon } from 'react-icons/fi';

import EtaDisplay from './EtaDisplay';
import { lineToStyle } from '../helpers';

const airports = ["O'Hare", 'Midway'];
const traintrackerUrl =
  'https://www.transitchicago.com/traintracker/arrivaltimes/?sid=';

const TrainList = props => {
  const station = props.station;
  const etas = station.etas;

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      centered
      className="station-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="font-weight-bold">
          <a
            href={`${traintrackerUrl}${station.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {station.name} {station.accessible && <AccessibleIcon />}{' '}
            {<LinkIcon />}
          </a>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant={'flush'}>
          {etas.map(eta => (
            <ListGroup.Item
              key={eta.id}
              className={`${lineToStyle(eta.lineName)} train-list`}
            >
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
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
};

export default TrainList;
