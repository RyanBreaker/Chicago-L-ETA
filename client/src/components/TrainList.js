import React, { useState } from 'react';
import axios from 'axios';

import { Col, ListGroup, Modal, Row, Spinner } from 'react-bootstrap';
import { FaWheelchair as AccessibleIcon } from 'react-icons/fa';
import { FiExternalLink as LinkIcon } from 'react-icons/fi';
import TrainListItem from './TrainListItem';

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
  const [trains, setTrains] = useState([]);
  const station = props.station;

  // 15 seconds for the auto-refresh;
  const refreshTime = 15;
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Loads the data into the etas state
  const getEtas = () => {
    setLoading(true);
    axios
      .get('/api/station', {
        params: { id: station.id }
      })
      .then(res => setTrains(res.data[0].etas || []))
      .then(() => setLoading(false));
  };

  /*
   Function for setting up the auto-refresh, call on the modal's onEnter
   and make sure to clear the interval on its onExit.
  */
  const refreshData = () => {
    getEtas();
    setRefreshInterval(window.setInterval(getEtas, refreshTime * 1000)); // Convert to seconds.
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      onEnter={refreshData}
      onExit={() => window.clearInterval(refreshInterval)}
      centered
      className="station-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="font-weight-bold" style={{ width: '100%' }}>
          <Row>
            <Col xs={9}>
              <a
                href={`${traintrackerUrl}${station.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {station.name} {station.accessible && <AccessibleIcon />}{' '}
                {<LinkIcon />}
              </a>
            </Col>
            <Col
              xs={3}
              className="d-flex justify-content-center align-items-center"
            >
              {loading ? <Spinner animation="grow" role="status" /> : null}
            </Col>
          </Row>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <ListGroup variant={'flush'}>
          {/* Only show the message if content also isn't being loaded. */}
          {trains.length === 0 && !loading ? (
            <CenterCol>
              <h4 className="font-weight-bold" style={{ margin: 0 }}>
                No trains were received for this station at this time.
              </h4>
            </CenterCol>
          ) : (
            trains.map(train => <TrainListItem key={train.id} train={train} />)
          )}
        </ListGroup>
      </Modal.Body>

      <Modal.Footer className="justify-content-center font-italic">
        Content auto-refreshes every {refreshTime} seconds.
      </Modal.Footer>
    </Modal>
  );
};

export default TrainList;
