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
  const [etas, setEtas] = useState([]);

  const station = props.station;

  const getEtas = () => {
    setLoading(true);
    axios
      .get('/api/station', {
        params: { id: station.id }
      })
      .then(res => setEtas(res.data[0].etas || []))
      .then(() => setLoading(false));
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
              etas.map(train => <TrainListItem train={train} />)
            )}
          </ListGroup>
        )}
      </Modal.Body>

      <Modal.Footer />
    </Modal>
  );
};

export default TrainList;
