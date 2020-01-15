import React from 'react';
import { Card } from 'react-bootstrap';
import { FaWheelchair as AccessibleIcon } from 'react-icons/fa';

import TrainList from './TrainList';

function Station(props) {
  const [showModal, setShowModal] = React.useState(false);
  const toggleModal = () => setShowModal(!showModal);

  const station = props.stationData;

  return (
    <Card className="station-card">
      <Card.Body onClick={toggleModal}>
        <Card.Title className="font-weight-bold">
          {station.name} {station.accessible && <AccessibleIcon />}
        </Card.Title>
      </Card.Body>
      <TrainList show={showModal} onHide={toggleModal} station={station} />
    </Card>
  );
}

export default Station;
