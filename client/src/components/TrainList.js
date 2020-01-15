import React, { useState } from 'react';
import axios from 'axios';

import { Col, ListGroup, Modal, Row, Spinner } from 'react-bootstrap';
import { FaWheelchair as AccessibleIcon } from 'react-icons/fa';
import { FiExternalLink as LinkIcon } from 'react-icons/fi';
import { IoMdAirplane as AirplaneIcon } from 'react-icons/io';

import EtaDisplay from './EtaDisplay';
import { lineToStyle } from '../helpers';

const airports = ["O'Hare", 'Midway'];
const traintrackerUrl =
  'https://www.transitchicago.com/traintracker/arrivaltimes/?sid=';

const CenterCol = props => {
  return (
    <Row className="justify-content-center">
      <Col className="text-center center-col" style={{ padding: '1rem 0' }}>
        {props.children}
      </Col>
    </Row>
  );
};

const TrainList = props => {
  const [loading, setLoading] = useState(true);
  const [etas, setEtas] = useState([]);

  const station = props.station;

  const getEtas = () => {
    axios
      .get(`/api/station/id/${station.id}`)
      .then(res => setEtas(res.data.etas || []))
      .then(() => setLoading(!loading));
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      onEnter={getEtas}
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
        {loading ? (
          <CenterCol>
            <Spinner animation={'border'} role={'status'} />
          </CenterCol>
        ) : (
          <ListGroup variant={'flush'}>
            {etas.length === 0 ? (
              <CenterCol>
                <h4 className="font-weight-bold" style={{ margin: 0 }}>
                  No trains were received for this station.
                </h4>
              </CenterCol>
            ) : (
              etas.map(eta => (
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
                      {airports.includes(eta.destination) ? (
                        <AirplaneIcon />
                      ) : null}
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
              ))
            )}
          </ListGroup>
        )}
      </Modal.Body>

      <Modal.Footer />
    </Modal>
  );
};

export default TrainList;
